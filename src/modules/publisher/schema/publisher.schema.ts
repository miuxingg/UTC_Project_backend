import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PublisherDocument = Publisher & Document;

@Schema({ timestamps: true })
export class Publisher {
  @Prop({ required: true })
  name: string;
}

export const PublisherSchema = SchemaFactory.createForClass(Publisher);
