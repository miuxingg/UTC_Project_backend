import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Order } from 'src/modules/order/schema/order.schema';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Book } from 'src/modules/books/schema/book.schema';

export type OrderLineDocument = OrderLine & Document;

@Schema({ timestamps: true })
export class OrderLine {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: Order.name,
  })
  orderId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: Book.name })
  bookId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

export const populateBook = [
  {
    $lookup: {
      from: 'books',
      foreignField: '_id',
      localField: 'bookId',
      as: 'book',
    },
  },
  { $unset: '$bookId' },
];

export const OrderLineSchema = SchemaFactory.createForClass(OrderLine);
