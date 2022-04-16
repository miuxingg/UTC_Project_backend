import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceBase } from 'src/common/ServiceBase';
import { Publisher, PublisherDocument } from './schema/publisher.schema';
import { Model, Types } from 'mongoose';
import { BaseQuery } from 'src/common/BaseDTO';
import { aggregateQuery } from 'src/common/Aggregate';

@Injectable()
export class PublisherService extends ServiceBase<PublisherDocument> {
  constructor(
    @InjectModel(Publisher.name) publisherModel: Model<PublisherDocument>,
  ) {
    super(publisherModel);
  }

  async getAllPublisher(queries: BaseQuery) {
    return await this.model.aggregate([
      { $sort: { _id: -1 } },
      ...aggregateQuery(queries),
    ]);
  }
}
