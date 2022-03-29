import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CatsModule } from './modules/cats/cats.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from './modules/books/books.module';
import { CategoryModule } from './modules/category/category.module';
import { AddressModule } from './modules/address/address.module';
import { AuthModule } from './modules/auth/auth.module';
import { mailerOptions } from './configs/mailer.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MONGO_CONNECTION } from './configs/mongodb.config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(MONGO_CONNECTION),
    MailerModule.forRoot(mailerOptions),
    CacheModule.register({ isGlobal: true, ttl: 900 }),
    CatsModule,
    BooksModule,
    CategoryModule,
    AddressModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
