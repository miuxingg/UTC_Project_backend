import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DocumentStatus } from 'src/utils/types';

export type PublisherDocument = Publisher & Document;

@Schema({ timestamps: true })
export class Publisher {
  @Prop({ required: true })
  name: string;

  @Prop({
    default: DocumentStatus.Approved,
    enum: Object.values(DocumentStatus),
  })
  status: DocumentStatus;
}

export const PublisherSchema = SchemaFactory.createForClass(Publisher);
PublisherSchema.index({ name: 'text' });
