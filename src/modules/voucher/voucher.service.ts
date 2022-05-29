import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceBase } from 'src/common/ServiceBase';
import { Voucher, VoucherDocument } from './schema/voucher.schema';
import { Model, Types } from 'mongoose';
import { BaseQuery } from 'src/common/BaseDTO';
import { DocumentStatus } from 'src/utils/types';
import { aggregatePagination } from 'src/common/Aggregate';
import { VoucherUpdateInput } from './dto/input.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VI_TIMEZONE } from 'src/configs';
import { SocketsGateway } from '../socket/socket.gateway';
import { EventNames } from '../socket/types/eventName';

@Injectable()
export class VoucherService extends ServiceBase<VoucherDocument> {
  constructor(
    @InjectModel(Voucher.name) voucherModule: Model<VoucherDocument>,
    private readonly socketsGateway: SocketsGateway,
  ) {
    super(voucherModule);
  }

  async getVoucherApproved(queries: BaseQuery) {
    const response = await this.model.aggregate([
      {
        $match: {
          documentStatus: DocumentStatus.Approved,
        },
      },
      ...aggregatePagination(queries),
    ]);
    return response;
  }

  async getVoucherByAdmin(queries: BaseQuery) {
    const match = {};
    if (queries && queries?.search) {
      match['$text'] = { $search: queries.search };
    }
    const response = await this.model.aggregate([
      { $match: match },
      { $sort: { _id: -1 } },
      ...aggregatePagination(queries),
    ]);
    return response;
  }

  async updateVoucher(id: string, voucherUpdate: VoucherUpdateInput) {
    const voucherDocument = await this.model.findById(id);
    if (!voucherDocument) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (voucherUpdate?.documentStatus) {
      voucherDocument.documentStatus = voucherUpdate.documentStatus;
    }
    if (voucherUpdate?.startDate) {
      voucherDocument.startDate = voucherUpdate.startDate;
    }
    if (voucherUpdate?.endDate) {
      voucherDocument.endDate = voucherUpdate.endDate;
    }
    if (voucherUpdate?.name) {
      voucherDocument.name = voucherUpdate.name;
    }
    if (voucherUpdate?.priceDiscound) {
      voucherDocument.priceDiscound = voucherUpdate.priceDiscound;
    }
    await voucherDocument.save();
    return voucherDocument;
  }

  // async getVoucherPending() {
  //   const currentTime = new Date();
  //   const [voucherPending] = await this.model.aggregate([
  //     {
  //       $match: {
  //         documentStatus: DocumentStatus.Pending,
  //         startDate: { $lte: currentTime },
  //       },
  //     },
  //     ...aggregatePagination({}),
  //   ]);
  //   return voucherPending;
  // }

  @Cron(CronExpression.EVERY_10_SECONDS, { timeZone: VI_TIMEZONE })
  async handleUpdateVoucher() {
    console.log('cron update voucher');

    const currentTime = new Date();
    const vouchersPending = await this.model.find({
      startDate: { $lte: currentTime },
      documentStatus: { $eq: DocumentStatus.Pending },
    });
    vouchersPending.forEach(async (voucher) => {
      console.log('Pending: ', voucher);

      voucher.documentStatus = DocumentStatus.Approved;
      this.socketsGateway.sendEvent(EventNames.UpdateVoucherReady, {
        id: voucher.id,
      });

      await voucher.save();
    });

    const vouchersApproved = await this.model.find({
      endDate: { $lt: currentTime },
      documentStatus: { $eq: DocumentStatus.Approved },
    });
    vouchersApproved.forEach(async (voucher) => {
      console.log('Approved: ', voucher);
      voucher.documentStatus = DocumentStatus.Rejected;

      voucher.documentStatus = DocumentStatus.Approved;
      this.socketsGateway.sendEvent(EventNames.UpdateVoucherExpire, {
        id: voucher.id,
      });

      await voucher.save();
    });
  }
}
