import { Injectable } from '@nestjs/common';
import { ServiceBase } from 'src/common/ServiceBase';
import { Blog, BlogDocument } from './schema/blog.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseQuery } from 'src/common/BaseDTO';
import { aggregateQuery } from 'src/common/Aggregate';
import { DocumentStatus } from 'src/utils/types';

@Injectable()
export class BlogService extends ServiceBase<BlogDocument> {
  constructor(@InjectModel(Blog.name) blogModel: Model<BlogDocument>) {
    super(blogModel);
  }

  async getAllBlog(queries?: BaseQuery) {
    const response = await this.model.aggregate([
      { $match: { documentStatus: DocumentStatus.Approved } },
      { $sort: { _id: -1 } },
      ...aggregateQuery(queries),
    ]);
    return response;
  }
}
