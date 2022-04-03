import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/modules/auth/schema/auth.schema';
import {
  IPaymentMethod,
  IShippingMethod,
  IPaymentStatus,
} from 'src/utils/types';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  user?: string;

  @Prop({ required: true })
  totalMoney: number;

  @Prop({ required: true })
  discount: number;

  @Prop({
    required: true,
    default: IPaymentMethod.COD,
    enum: Object.values(IPaymentMethod),
  })
  paymentMethod: string;

  @Prop({ required: true, type: Object })
  shippingMethod: IShippingMethod;

  @Prop({
    required: true,
    default: IPaymentStatus.Pending,
    enum: Object.values(IPaymentStatus),
  })
  status: string;
}

export const populateOrderLines = [
  {
    $lookup: {
      from: 'orderlines',
      foreignField: 'orderId',
      localField: '_id',
      as: 'orderLines',
      pipeline: [
        {
          $lookup: {
            from: 'books',
            foreignField: '_id',
            localField: 'bookId',
            as: 'book',
          },
        },
      ],
    },
  },
];

export const OrderSchema = SchemaFactory.createForClass(Order);
