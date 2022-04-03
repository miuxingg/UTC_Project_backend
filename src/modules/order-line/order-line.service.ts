import { Injectable } from '@nestjs/common';
import { ServiceBase } from 'src/common/ServiceBase';
import { OrderLine, OrderLineDocument } from './schema/orderLine.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrderLineService extends ServiceBase<OrderLineDocument> {
  constructor(
    @InjectModel(OrderLine.name) orderLineModel: Model<OrderLineDocument>,
  ) {
    super(orderLineModel);
  }
}
