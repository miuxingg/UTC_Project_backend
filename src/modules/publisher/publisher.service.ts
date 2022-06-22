import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceBase } from 'src/common/ServiceBase';
import { Publisher, PublisherDocument } from './schema/publisher.schema';
import { Model, Types } from 'mongoose';
import { BaseQuery } from 'src/common/BaseDTO';
import { aggregateQuery } from 'src/common/Aggregate';
import { PublisherInputDto } from './dto/input.dto';
import { DocumentStatus } from 'src/utils/types';

@Injectable()
export class PublisherService extends ServiceBase<PublisherDocument> {
  constructor(
    @InjectModel(Publisher.name) publisherModel: Model<PublisherDocument>,
  ) {
    super(publisherModel);
  }

  async getAllPublisher(queries: BaseQuery) {
    const match = {
      status: DocumentStatus.Approved,
    };
    if (queries && queries?.search) {
      match['$text'] = { $search: queries.search };
    }
    return await this.model.aggregate([
      { $match: match },
      { $sort: { _id: -1 } },
      ...aggregateQuery(queries),
    ]);
  }

  async getAllPublisherAdmin(queries: BaseQuery) {
    const match = {};
    if (queries && queries?.search) {
      match['$text'] = { $search: queries.search };
    }
    return await this.model.aggregate([
      { $match: match },
      { $sort: { _id: -1 } },
      ...aggregateQuery(queries),
    ]);
  }

  async updatePublisher(id: string, input: PublisherInputDto) {
    const publisher = await this.model.findById(id);
    if (!publisher) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    publisher.name = input.name;
    await publisher.save();
    return publisher;
  }

  async updateStatusPublisher(id: string, input: PublisherInputDto) {
    const publisher = await this.model.findById(id);
    if (!publisher) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    publisher.status = input.status;
    await publisher.save();
    return publisher;
  }
}
