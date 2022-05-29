import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketModule } from '../socket/socket.module';
import { Voucher, VoucherSchema } from './schema/voucher.schema';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Voucher.name, schema: VoucherSchema }]),
    SocketModule,
  ],
  controllers: [VoucherController],
  providers: [VoucherService],
})
export class VoucherModule {}
