import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BlogDocument = Blog & Document;
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { DocumentStatus } from 'src/utils/types';

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({
    default: DocumentStatus.Approved,
    enum: Object.values(DocumentStatus), // Is the book displayed?
  })
  documentStatus: string;

  @Prop({ required: true })
  image: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.index({ title: 'text' });
