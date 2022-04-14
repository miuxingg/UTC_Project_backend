import { Injectable } from '@nestjs/common';
import { ServiceBase } from 'src/common/ServiceBase';
import {
  OrderLine,
  OrderLineDocument,
  populateBookWithStatusSuccess,
} from './schema/orderLine.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { aggregateQuery } from 'src/common/Aggregate';

@Injectable()
export class OrderLineService extends ServiceBase<OrderLineDocument> {
  constructor(
    @InjectModel(OrderLine.name) orderLineModel: Model<OrderLineDocument>,
  ) {
    super(orderLineModel);
  }

  async bookBestSaler() {
    const [response] = await this.model.aggregate([
      ...populateBookWithStatusSuccess,
      ...aggregateQuery(),
    ]);

    const statisticBookByOrder = response.items.reduce((pre, cur) => {
      return !pre[String(cur.bookId)]
        ? { ...pre, [String(cur.bookId)]: 1 }
        : { ...pre, [String(cur.bookId)]: pre[String(cur.bookId)] + 1 };
    }, {});

    const bookByOrderArray = Object.keys(statisticBookByOrder)
      .map((key) => {
        return { bookId: key, statistic: statisticBookByOrder[key] };
      })
      .sort((x, y) => y.statistic - x.statistic);

    return bookByOrderArray;
  }
}
