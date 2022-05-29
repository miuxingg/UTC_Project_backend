import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { BaseQuery } from 'src/common/BaseDTO';
import { ManagementGuard } from 'src/libs/Guard/management.guard';
import { VoucherInputDto, VoucherUpdateInput } from './dto/input.dto';
import { VoucherOutputDto } from './dto/output.dto';
import { VoucherService } from './voucher.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VI_TIMEZONE } from 'src/configs';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get()
  async getVoucherApproved(@Query() queries: BaseQuery) {
    const [response] = await this.voucherService.getVoucherApproved(queries);
    return {
      items: plainToClass(VoucherOutputDto, response?.items ?? []),
      total: response?.total ?? 0,
    };
  }
  @Get('admin')
  @UseGuards(ManagementGuard)
  async getVoucherByAdmin(@Query() queries: BaseQuery) {
    const [response] = await this.voucherService.getVoucherByAdmin(queries);
    return {
      items: plainToClass(VoucherOutputDto, response?.items ?? []),
      total: response?.total ?? 0,
    };
  }

  // @Get('pending')
  // async getPedding() {
  //   return await this.voucherService.getVoucherPending();
  // }

  @Get(':id')
  async getVoucherById(@Param('id') id: string) {
    const response = await this.voucherService.findById(id);
    if (!response) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return plainToClass(VoucherOutputDto, response);
  }

  @Post()
  @UseGuards(ManagementGuard)
  async createVoucher(@Body() voucherCreate: VoucherInputDto) {
    const data = await this.voucherService.create({ ...voucherCreate });
    return plainToClass(VoucherOutputDto, data);
  }

  @Put(':id')
  @UseGuards(ManagementGuard)
  async updateVoucher(
    @Param('id') id: string,
    @Body() voucherUpdate: VoucherUpdateInput,
  ) {
    const response = await this.voucherService.updateVoucher(id, voucherUpdate);
    return plainToClass(VoucherOutputDto, response);
  }

  // @Cron(CronExpression.EVERY_10_SECONDS, { timeZone: VI_TIMEZONE })
  // async handleUpdateStatsVoucher() {
  //   console.log('time zone running');
  //   const voucherStart = await this.voucherService.
  // }
}
