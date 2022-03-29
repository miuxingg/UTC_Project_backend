import { Controller, Get, Query } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('provices')
  async getProvices() {
    const response = await this.addressService.provices();
    return response;
  }

  @Get('districts')
  async getDistricts(@Query('proviceId') proviceId: number) {
    const response = await this.addressService.districtsByProvince(+proviceId);
    return response;
  }

  @Get('wards')
  async getWards(@Query('districtId') districtId: number) {
    const response = await this.addressService.wardsByDistricts(+districtId);
    return response;
  }
}
