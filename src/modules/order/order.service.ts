import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceBase } from 'src/common/ServiceBase';
import {
  Order,
  OrderDocument,
  populateOrderLines,
} from './schema/order.schema';
import { Model, Types } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../cart/cart.service';
import { OrderLineService } from '../order-line/order-line.service';
import { OrderHistoryQuery, OrderInputDto } from './dto/input.dto';
import { DocumentStatus, IIAMUser, IOrderStatus } from 'src/utils/types';
import { MailerService } from '../services/mailer.service';
import { BooksService } from '../books/books.service';
import { aggregateQuery } from 'src/common/Aggregate';
import dayjs from 'dayjs';

@Injectable()
export class OrderService extends ServiceBase<OrderDocument> {
  constructor(
    @InjectModel(Order.name) orderModel: Model<OrderDocument>,
    private readonly userService: AuthService,
    private readonly orderLineService: OrderLineService,
    private readonly cartService: CartService,
    private readonly mailerService: MailerService,
    private readonly booksService: BooksService,
  ) {
    super(orderModel);
  }

  async getAllOrderByUser(userId: string, queries: OrderHistoryQuery) {
    const order = await this.model.aggregate([
      { $match: { user: new Types.ObjectId(userId), status: queries.status } },
      { $sort: { _id: -1 } },
      ...populateOrderLines,
      ...aggregateQuery(),
    ]);
    return order;
  }

  async getAllOrderByAdmin(queries: OrderHistoryQuery) {
    const order = await this.model.aggregate([
      { $match: { status: queries.status } },
      { $sort: { _id: -1 } },
      ...populateOrderLines,
      ...aggregateQuery(),
    ]);
    return order;
  }

  async updateStatusOrder(id: string, input: OrderHistoryQuery) {
    const order = await this.model.findById(id);
    if (!order) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (input.status === IOrderStatus.Rejected) {
      const orderLine = await this.orderLineService.findAll({
        orderId: order.id,
      });

      orderLine.items.forEach(async (item) => {
        const book = await this.booksService.findById(item.bookId);
        book.quantity = book.quantity + item.quantity;
        await book.save();
      });
    }
    order.status = input.status;
    await order.save();
    return order;
  }

  async createOrder(iamUser: IIAMUser, data: OrderInputDto) {
    const user = await this.userService.findById(iamUser?.id);
    const books = data.orderLines;
    const dataCreate = user?.id ? { ...data, user: user.id } : { ...data };
    const order = await this.model.create(dataCreate);

    const orderLine = books.map(async (book) => {
      return await this.orderLineService.create({
        orderId: order.id,
        bookId: book.bookId,
        quantity: book.quantity,
        price: book.price,
      });
    });

    const orderResponse = await Promise.all(orderLine);
    orderResponse.forEach(async (item) => {
      const book = await this.booksService.findById(item.bookId);
      book.quantity = book.quantity - item.quantity;
      await book.save();
    });
    let email = data.shippingMethod.email;
    let name = `${data.shippingMethod.firstName} ${data.shippingMethod.lastName}`;
    if (user) {
      await this.cartService.deleteCartByUser(user.id);
      email = user.email;
      name = `${user.firstName} ${user.lastName}`;
    }
    const line = orderResponse.map(async (item) => {
      const [response] = await this.booksService.getBookById(item.bookId);
      return response;
    });
    const booksInOrder = await Promise.all(line);

    const orderSendMail = booksInOrder.map((item) => {
      return { name: item.name, price: item.price };
    });

    if (email) {
      this.mailerService.thanksTo(email, { name, orderLine: orderSendMail });
    }
    return orderResponse;
  }

  async statistics() {
    const orderDetails = await this.model.aggregate([
      {
        $match: {
          status: IOrderStatus.Success,
        },
      },
      ...populateOrderLines,
    ]);
    const statisticOrder = orderDetails.reduce(
      (pre, cur) => {
        const numberBooks: number = cur.orderLines.reduce((total, line) => {
          return total + line.quantity;
        }, 0);
        return {
          totalMoney: pre.totalMoney + cur.totalMoney,
          numberOfBooksSold: pre.numberOfBooksSold + numberBooks,
        };
      },
      {
        totalMoney: 0,
        numberOfBooksSold: 0,
      },
    );
    const totalBooksAvailable = await this.booksService.findAll({
      documentStatus: DocumentStatus.Approved,
    });
    const booksInventory = await this.booksService.booksInventory();
    const statistic = {
      ...statisticOrder,
      booksAvailable: totalBooksAvailable.total,
      booksInventory,
    };
    return statistic;
  }
  async statisticDataset() {
    const orderDetails = await this.model.aggregate([
      {
        $match: {
          status: IOrderStatus.Success,
        },
      },
      ...populateOrderLines,
    ]);

    const dataset = orderDetails.reduce(
      (pre, cur) => {
        const month = dayjs(cur.createdAt).month() + 1;
        const numberBooks: number = cur.orderLines.reduce((total, line) => {
          return total + line.quantity;
        }, 0);
        return {
          money: {
            ...pre?.money,
            [month]: (pre?.money?.[month] || 0) + cur.totalMoney,
          },
          quantity: {
            ...pre?.quantity,
            [month]: (pre?.quantity?.[month] || 0) + numberBooks,
          },
        };
      },
      {
        money: {},
        quantity: {},
      },
    );
    return dataset;
  }
}
