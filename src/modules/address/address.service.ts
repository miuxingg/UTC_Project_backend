import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ADDRESS_URL } from 'src/configs';

@Injectable()
export class AddressService {
  private requestAxios: AxiosInstance;

  constructor() {
    this.requestAxios = axios.create({ baseURL: ADDRESS_URL });
  }

  async provices() {
    const { data } = await this.requestAxios.get('/p');
    return data;
  }

  async districtsByProvince(proviceId: number) {
    const {
      data: { districts },
    } = await this.requestAxios.get(`/p/${proviceId}`, {
      params: { depth: 2 },
    });

    return districts;
  }

  async wardsByDistricts(districtId: number) {
    const {
      data: { wards },
    } = await this.requestAxios.get(`/d/${districtId}`, {
      params: { depth: 2 },
    });
    return wards;
  }
}
