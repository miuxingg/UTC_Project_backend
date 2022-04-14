import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { AuthModule } from '../auth/auth.module';
import { OrderLineModule } from '../order-line/order-line.module';
import { CartModule } from '../cart/cart.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    AuthModule,
    OrderLineModule,
    CartModule,
    ServicesModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
