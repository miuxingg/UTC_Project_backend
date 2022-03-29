import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CatsController } from './modules/cats/cats.controller';
import { CatsModule } from './modules/cats/cats.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from './modules/books/books.module';
import { CategoryModule } from './modules/category/category.module';
import { AddressModule } from './modules/address/address.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://bookstore:admin@cluster0.lox7k.mongodb.net/BookStore?retryWrites=true&w=majority',
    ),
    CatsModule,
    BooksModule,
    CategoryModule,
    AddressModule,
  ],
  controllers: [CatsController],
  providers: [],
})
export class AppModule {}
