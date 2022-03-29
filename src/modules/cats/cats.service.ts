import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from './schema/cats.schema';
import { Model } from 'mongoose';
import { ServiceBase } from 'src/common/ServiceBase';

@Injectable()
export class CatsService extends ServiceBase<CatDocument> {
  constructor(@InjectModel(Cat.name) catModel: Model<CatDocument>) {
    super(catModel);
  }
  async setCats() {
    return await this.create({ name: 'Munc', age: 23 });
  }
}
