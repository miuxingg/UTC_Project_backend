import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderLineModule } from '../order-line/order-line.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book, BookSchema } from './schema/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    OrderLineModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
