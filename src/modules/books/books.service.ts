import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceBase } from 'src/common/ServiceBase';
import {
  Book,
  BookDocument,
  populateBook,
  // bookPopulate,
  populateCategory,
  populatePublisher,
} from './schema/book.schema';
import { Model, Types } from 'mongoose';
import {
  BookQuery,
  CheckQuantityBooksInput,
  CreateBookDto,
} from './dto/input.dto';
import { aggregateQuery } from 'src/common/Aggregate';
import { filterByPrice } from 'src/utils/buildQueryBook';
import { OrderLineService } from '../order-line/order-line.service';

@Injectable()
export class BooksService extends ServiceBase<BookDocument> {
  constructor(
    @InjectModel(Book.name) bookModel: Model<BookDocument>,
    private readonly orderLineService: OrderLineService,
  ) {
    super(bookModel);
  }
  async createBook(bookCreate: CreateBookDto) {
    return await this.create({ ...bookCreate });
  }

  async getAllBook(queries?: BookQuery) {
    let match = {};
    if (queries && queries.status) {
      match['status'] = { $eq: queries.status };
    }
    if (queries && queries?.category) {
      match['category'] = { $in: [new Types.ObjectId(queries.category)] };
    }
    if (queries && queries?.publisher) {
      match['publishers'] = { $in: [new Types.ObjectId(queries.publisher)] };
    }
    if (queries && queries?.search) {
      match['$text'] = { $search: queries.search };
    }
    if (queries && queries?.cloudTag) {
      match['cloudTag'] = { $in: [queries.cloudTag] };
    }

    if (queries && (queries?.startPrice || queries?.endPrice)) {
      match = {
        ...match,
        ...filterByPrice(+queries.startPrice, +queries.endPrice),
      };
    }

    const data = await this.model.aggregate([
      { $match: match },
      { $sort: { _id: -1 } },
      ...populateCategory(),
      ...populateBook(),
      ...populatePublisher(),
      ...aggregateQuery(queries),
    ]);

    return data;
  }

  async getBookById(id: string) {
    return await this.model.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      ...populateCategory(),
      ...populateBook(),
      ...populatePublisher(),
    ]);
  }

  async getBookByIds(ids: string[]) {
    const idsMapping = ids.map((id) => new Types.ObjectId(id));
    return await this.model.aggregate([
      { $match: { _id: { $in: idsMapping } } },
      ...populateCategory(),
      ...populatePublisher(),
      ...populateBook(),
      ...aggregateQuery(),
    ]);
  }

  async getCloudTags() {
    const response = await this.model.aggregate([{ $sample: { size: 10 } }]);
    const cloudTags = [];
    response.forEach((item) => {
      item.cloudTag.forEach((cloudTag) => {
        cloudTags.push(cloudTag);
      });
    });
    return cloudTags.reduce((accumulator, element) => {
      if (accumulator.indexOf(element) === -1) {
        accumulator.push(element);
      }
      return accumulator;
    }, []);
  }

  async getBookBestSaler() {
    const statisticBook = await this.orderLineService.bookBestSaler();
    const listIdBookStatistic = statisticBook
      .map((item) => {
        return new Types.ObjectId(item.bookId);
      })
      .slice(0, 10);
    const listBookPromise = listIdBookStatistic.map(async (item) => {
      return await this.model.findById(item);
    });

    const response = await Promise.all(listBookPromise);
    return { items: response, total: response.length };
  }

  async checkQuantityListBooks(listBooks: CheckQuantityBooksInput[]) {
    const obj = {};
    const ids = listBooks.map((book) => {
      obj[book.bookId] = book.quantity;
      return new Types.ObjectId(book.bookId);
    });

    const response = await this.model.aggregate([
      {
        $match: {
          _id: { $in: ids },
        },
      },
    ]);
    const data = response.map((item) => {
      return { ...item, isQuantity: item.quantity >= obj[item._id] };
    });
    return data;
  }

  async updateQuantity(bookId: string, quantity: number) {
    const book = await this.model.findById(bookId);
    if (book) {
      book.quantity = book.quantity + quantity; //minus: - , add: +
      await book.save();
      return book;
    } else {
      return false;
    }
  }
}
