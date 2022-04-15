import { Injectable } from '@nestjs/common';
import { ServiceBase } from 'src/common/ServiceBase';
import { Review, ReviewDocument, reviewOnBook } from './schema/review.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseQuery } from 'src/common/BaseDTO';
import { aggregateQuery } from 'src/common/Aggregate';

@Injectable()
export class ReviewsService extends ServiceBase<ReviewDocument> {
  constructor(@InjectModel(Review.name) reviewModel: Model<ReviewDocument>) {
    super(reviewModel);
  }
  async getReviewsOnBook(bookId: string, queries?: BaseQuery): Promise<any> {
    return await this.model.aggregate([
      ...reviewOnBook(bookId),
      { $sort: { _id: -1 } },
      ...aggregateQuery(queries),
    ]);
  }
}
