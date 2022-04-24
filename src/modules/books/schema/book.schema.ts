import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Category } from 'src/modules/category/schema/category.schema';
import { Publisher } from 'src/modules/publisher/schema/publisher.schema';
import { BookStatus, DocumentStatus } from 'src/utils/types';

export type BookDocument = Book & Document;
@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    default: [],
    type: [MongooseSchema.Types.ObjectId],
    ref: Category.name,
  })
  category: string[];

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: 0 })
  priceUnDiscount: number;

  @Prop({ required: true, default: 0 })
  quantity: number;

  @Prop({ required: true, default: [] })
  cloudTag: string[];

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ required: true, default: [] })
  images: string[];

  @Prop({ default: BookStatus.NONE, enum: Object.values(BookStatus) }) // HOT, NEW, NONE
  status?: string;

  @Prop({
    default: DocumentStatus.Pending,
    enum: Object.values(DocumentStatus), // Is the book displayed?
  })
  documentStatus: string;

  @Prop({ default: '' })
  summary?: string;

  @Prop({
    required: true,
    default: [],
    type: [MongooseSchema.Types.ObjectId],
    ref: Publisher.name,
  })
  publishers: string[];

  @Prop({ required: true, default: false })
  isCombo: boolean;

  @Prop({
    required: true,
    default: [],
    type: [MongooseSchema.Types.ObjectId],
    ref: Book.name,
  })
  books: string[];
}
// export const bookPopulate = ['categories'];

export const populateCategory = () => {
  return [
    {
      $lookup: {
        from: 'categories',
        foreignField: '_id',
        localField: 'category',
        as: 'category',
      },
    },
  ];
};

export const populatePublisher = () => {
  return [
    {
      $lookup: {
        from: 'publishers',
        foreignField: '_id',
        localField: 'publishers',
        as: 'publishers',
      },
    },
  ];
};

export const populateBook = () => {
  return [
    // { $unwind: '$books' },
    {
      $lookup: {
        from: 'books',
        localField: 'books',
        foreignField: '_id',
        as: 'books',
      },
    },
  ];
};

export const populateFavorite = (userId?: string) => {
  if (!userId)
    return [
      {
        $set: {
          isFavorite: false,
        },
      },
    ];
  return [
    {
      $lookup: {
        from: 'favorites',
        localField: '_id',
        foreignField: 'book',
        as: 'favorite',
        pipeline: [
          {
            $match: { user: new Types.ObjectId(userId) },
          },
        ],
      },
    },
    {
      $set: {
        isFavorite: { $toBool: { $size: '$favorite' } },
      },
    },
    { $unset: ['favorite'] },
  ];
};

export const BookSchema = SchemaFactory.createForClass(Book);
BookSchema.index({ name: 'text', author: 'text' });
