import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DocumentStatus } from 'src/utils/types';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type VoucherDocument = Document & Voucher;

@Schema({ timestamps: true })
export class Voucher {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  priceDiscound: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    default: DocumentStatus.Pending,
    enum: Object.values(DocumentStatus), // Is the book displayed?
  })
  documentStatus: string;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
VoucherSchema.index({ name: 'text' });
