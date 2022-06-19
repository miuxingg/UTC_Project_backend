import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceBase } from 'src/common/ServiceBase';
import { Config, ConfigDocument, populateConfig } from './schema/config.schema';
import { Model, Types } from 'mongoose';
import { CreateConfig } from './dto/input.dto';

@Injectable()
export class ConfigsService extends ServiceBase<ConfigDocument> {
  constructor(@InjectModel(Config.name) configModel: Model<ConfigDocument>) {
    super(configModel);
  }

  async getConfig() {
    const response = await this.model.aggregate([...populateConfig]);
    return response;
  }

  async updateConfig(input: CreateConfig) {
    const configDocument = await this.model.findOne();
    if (configDocument) {
      if (input?.blog) {
        configDocument.blog = input.blog;
      }
      if (input?.shippingMoney) {
        configDocument.shippingMoney = input.shippingMoney;
      }
      if (input?.shopInfomation) {
        configDocument.shopInfomation = input.shopInfomation;
      }
      const data = await configDocument.save();
      return data;
    } else {
      return await this.model.create({ ...input });
    }
  }
}
