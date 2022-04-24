import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/modules/auth/schema/auth.schema';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Book } from 'src/modules/books/schema/book.schema';

export type FavoriteDocument = Document & Favorite;

@Schema({ timestamps: true })
export class Favorite {
  @Prop({
    required: true,
    ref: User.name,
    type: MongooseSchema.Types.ObjectId,
  })
  user: string;

  @Prop({
    required: true,
    ref: Book.name,
    type: MongooseSchema.Types.ObjectId,
  })
  book: string;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
