import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DocumentStatus } from 'src/utils/types';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({
    default: DocumentStatus.Approved,
    enum: Object.values(DocumentStatus),
  })
  status: DocumentStatus;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ name: 'text' });
