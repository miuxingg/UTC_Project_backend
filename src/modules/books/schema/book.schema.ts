import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from 'src/modules/category/schema/category.schema';
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

  @Prop({ default: BookStatus.NONE, enum: Object.values(BookStatus) })
  status: string;

  @Prop({
    default: DocumentStatus.Pending,
    enum: Object.values(DocumentStatus),
  })
  documentStatus: string;
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

export const BookSchema = SchemaFactory.createForClass(Book);
BookSchema.index({ name: 'text', author: 'text' });
