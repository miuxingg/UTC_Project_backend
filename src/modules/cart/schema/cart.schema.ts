import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/modules/auth/schema/auth.schema';
import { Book } from 'src/modules/books/schema/book.schema';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: User.name })
  userId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: Book.name })
  bookId: string;

  @Prop({ required: true })
  quantity: number;
}

export const populateBook = () => [
  {
    $lookup: {
      from: 'books',
      foreignField: '_id',
      localField: 'bookId',
      as: 'item',
    },
  },
  { $unwind: '$item' },
  { $unset: 'bookId' },
];

export const CartSchema = SchemaFactory.createForClass(Cart);
