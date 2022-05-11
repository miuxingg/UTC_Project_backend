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
import { IIAMUser, IOrderStatus } from 'src/utils/types';
import { MailerService } from '../services/mailer.service';
import { BooksService } from '../books/books.service';
import { aggregateQuery } from 'src/common/Aggregate';

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
    let email = data.shippingMethod.email;
    let name = `${data.shippingMethod.firstName} ${data.shippingMethod.lastName}`;
    if (user) {
      await this.cartService.deleteCartByUser(user.id);
      email = user.email;
      name = `${user.firstName} ${user.lastName}`;
    }
    console.log(email, name);
    // const line = orderResponse.map((item) => {
    //   return { name: item.bookId };
    // });
    // if (email) {
    //   this.mailerService.thanksTo(email, { name, orderLine: line });
    // }
    return orderResponse;
  }
}
