import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Blog } from 'src/modules/blog/schema/blog.schema';

export type ConfigDocument = Document & Config;

@Schema({ timestamps: true })
export class Config {
  @Prop({
    required: true,
    default: [],
    type: [MongooseSchema.Types.ObjectId],
    ref: Blog.name,
  })
  blog: string[];
}

export const populateConfig = [
  {
    $lookup: {
      from: 'blogs',
      localField: 'blog',
      foreignField: '_id',
      as: 'blog',
    },
  },
];

export const ConfigSchema = SchemaFactory.createForClass(Config);
