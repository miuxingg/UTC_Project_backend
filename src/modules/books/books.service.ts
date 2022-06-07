import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceBase } from 'src/common/ServiceBase';
import {
  Book,
  BookDocument,
  populateBook,
  // bookPopulate,
  populateCategory,
  populateFavorite,
  populatePublisher,
  populateRating,
} from './schema/book.schema';
import { Model, Types } from 'mongoose';
import {
  BookQuery,
  CheckQuantityBooksInput,
  CreateBookDto,
  UpdateDocumentStatusInput,
} from './dto/input.dto';
import { aggregateQuery } from 'src/common/Aggregate';
import { filterByPrice } from 'src/utils/buildQueryBook';
import { OrderLineService } from '../order-line/order-line.service';
import { BaseQuery } from 'src/common/BaseDTO';
import { DocumentStatus } from 'src/utils/types';

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

  async getAllBook(queries?: BookQuery, userId?: string) {
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
      ...populateFavorite(userId),
      ...populateRating(),
      ...aggregateQuery(queries),
    ]);

    return data;
  }

  async getBookById(id: string, userId?: string) {
    return await this.model.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      ...populateCategory(),
      ...populateBook(),
      ...populatePublisher(),
      ...populateFavorite(userId),
      ...populateRating(),
    ]);
  }

  async getBookByIds(ids: string[], userId?: string) {
    const idsMapping = ids.map((id) => new Types.ObjectId(id));
    return await this.model.aggregate([
      { $match: { _id: { $in: idsMapping } } },
      ...populateCategory(),
      ...populatePublisher(),
      ...populateBook(),
      ...populateFavorite(userId),
      ...populateRating(),
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

  async getBookByCombos(userId?: string, queries?: BaseQuery) {
    return await this.model.aggregate([
      { $match: { isCombo: true } },
      ...populateCategory(),
      ...populateBook(),
      ...populatePublisher(),
      ...populateFavorite(userId),
      ...populateRating(),
      ...aggregateQuery(queries),
    ]);
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

  async updateBook(bookId: string, data: CreateBookDto) {
    const bookDocument = await this.model.findById(bookId);
    if (!bookDocument) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    bookDocument.name = data.name;
    bookDocument.category = data.category;
    bookDocument.author = data.author;
    bookDocument.description = data.description;
    bookDocument.price = data.price;
    bookDocument.priceUnDiscount = data.priceUnDiscount;
    bookDocument.quantity = data.quantity;
    bookDocument.cloudTag = data.cloudTag;
    bookDocument.thumbnail = data.thumbnail;
    bookDocument.images = data.images;
    bookDocument.status = data.status;
    bookDocument.summary = data.summary;
    bookDocument.publishers = data.publishers;
    bookDocument.isCombo = data.isCombo;
    bookDocument.books = data.books;
    await bookDocument.save();
    return bookDocument;
  }
  async updateDocumentStatus(bookId: string, data: UpdateDocumentStatusInput) {
    const bookDocument = await this.model.findById(bookId);
    if (!bookDocument) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    bookDocument.documentStatus = data.documentStatus;
    await bookDocument.save();
    return bookDocument;
  }

  async booksInventory() {
    const bookAvailable = await this.model
      .find({
        documentStatus: DocumentStatus.Approved,
      })
      .lean();

    const inventory = bookAvailable.reduce((pre, cur) => {
      return pre + cur.quantity;
    }, 0);

    return inventory;
  }
}
