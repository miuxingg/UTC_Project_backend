import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/modules/auth/schema/auth.schema';
import { Book } from 'src/modules/books/schema/book.schema';
import { Types } from 'mongoose';

export type ReviewDocument = Document & Review;

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: User.name })
  userId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: Book.name })
  bookId: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ required: true })
  rating: number;
}

export const reviewOnBook = (bookId: string) => [
  {
    $match: {
      bookId: new Types.ObjectId(bookId),
    },
  },
  {
    $lookup: {
      from: 'users',
      foreignField: '_id',
      localField: 'userId',
      as: 'user',
    },
  },
  {
    $unwind: '$user',
  },
];

export const ReviewSchema = SchemaFactory.createForClass(Review);
