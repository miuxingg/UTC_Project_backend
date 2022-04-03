import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceBase } from 'src/common/ServiceBase';
import {
  Order,
  OrderDocument,
  populateOrderLines,
} from './schema/order.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class OrderService extends ServiceBase<OrderDocument> {
  constructor(@InjectModel(Order.name) orderModel: Model<OrderDocument>) {
    super(orderModel);
  }

  async getAllOrderByUser(userId: string) {
    const order = await this.model.aggregate([
      { $match: { user: new Types.ObjectId(userId) } },
      ...populateOrderLines,
    ]);
    return order;
  }
}
