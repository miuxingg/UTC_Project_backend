import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from './modules/books/books.module';
import { CategoryModule } from './modules/category/category.module';
import { AddressModule } from './modules/address/address.module';
import { AuthModule } from './modules/auth/auth.module';
import { mailerOptions } from './configs/mailer.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MONGO_CONNECTION } from './configs/mongodb.config';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { OrderLineModule } from './modules/order-line/order-line.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { SocketModule } from './modules/socket/socket.module';
import { PublisherModule } from './modules/publisher/publisher.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { GoogleStrategy } from './modules/strategy/google.strategy';
import { BlogModule } from './modules/blog/blog.module';
import { ConfigsModule } from './modules/configs/configs.module';
import { VoucherModule } from './modules/voucher/voucher.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(MONGO_CONNECTION),
    MailerModule.forRoot(mailerOptions),
    CacheModule.register({ isGlobal: true, ttl: 900 }),
    ScheduleModule.forRoot(),
    BooksModule,
    CategoryModule,
    AddressModule,
    AuthModule,
    CartModule,
    OrderModule,
    OrderLineModule,
    PaymentModule,
    ReviewsModule,
    SocketModule,
    PublisherModule,
    FavoriteModule,
    BlogModule,
    ConfigsModule,
    VoucherModule,
  ],
  controllers: [],
  providers: [GoogleStrategy],
})
export class AppModule {}
