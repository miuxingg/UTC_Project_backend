import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceBase } from 'src/common/ServiceBase';
import { Cart, CartDocument, populateBook } from './schema/cart.schema';
import { Model, Types } from 'mongoose';
import { CreateCartDto } from './dto/input.dto';
import { BooksService } from '../books/books.service';
import { aggregateQuery } from 'src/common/Aggregate';
import { BaseQuery } from 'src/common/BaseDTO';

@Injectable()
export class CartService extends ServiceBase<CartDocument> {
  constructor(
    @InjectModel(Cart.name) cartModel: Model<CartDocument>,
    private readonly bookService: BooksService,
  ) {
    super(cartModel);
  }

  async createItem(cart: CreateCartDto, userId: string) {
    const alreadyItem = await this.model.findOne({ bookId: cart.bookId });
    if (!alreadyItem) {
      const response = await this.model.create({ ...cart, userId });
      const bookInfo = await this.bookService.findById(response.bookId);
      return { id: response._id, item: bookInfo, quantity: response.quantity };
    }
    alreadyItem.quantity = cart.quantity;
    await alreadyItem.save();
    const bookInfo = await this.bookService.findById(alreadyItem.bookId);
    return { id: alreadyItem._id, item: bookInfo, quantity: cart.quantity };
  }

  async getAllCart(userId: string, query: BaseQuery) {
    const response = await this.model.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $sort: { _id: -1 } },
      ...populateBook(),
      ...aggregateQuery(query),
    ]);
    return response;
  }

  async deleteCartByUser(userId: string) {
    return await this.model.deleteMany({ userId: new Types.ObjectId(userId) });
  }

  async updateById(id: string, body: any) {
    const doc = await this.model.findById(id);
    doc.quantity = body.quantity;
    await doc.save();
    return doc;
  }
}
