import { Module } from '@nestjs/common';
import { OrderLineService } from './order-line.service';
import { OrderLineController } from './order-line.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderLine, OrderLineSchema } from './schema/orderLine.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OrderLine.name,
        schema: OrderLineSchema,
      },
    ]),
    AuthModule,
  ],
  providers: [OrderLineService],
  controllers: [OrderLineController],
  exports: [OrderLineService],
})
export class OrderLineModule {}
