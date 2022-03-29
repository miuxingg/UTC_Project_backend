import { Document, FilterQuery, Model } from 'mongoose';

import { buildQueryOption } from '../utils/buildQueryOption';
import { PaginationOutput } from './BaseDTO';

export class ServiceBase<T extends Document> {
  constructor(protected model: Model<T>, private populate?: any) {}

  async findAll(
    filter?: FilterQuery<T>,
    options?: Record<string, any>,
  ): Promise<PaginationOutput<T>> {
    const queryOptions = buildQueryOption(options);
    const [items, total] = await Promise.all([
      this.populate
        ? this.model.find(filter, null, queryOptions).populate(this.populate)
        : this.model.find(filter, null, queryOptions),
      this.model.countDocuments(filter),
    ]);

    return {
      items,
      total,
    };
  }

  async findAllWithoutPaging(filter?: FilterQuery<T>): Promise<T[]> {
    return await this.model.find(filter);
  }

  async findById(id: string): Promise<T> {
    const doc = await this.model.findById(id);
    if (doc) return this.populate ? doc.populate(this.populate) : doc;
  }

  async findOne(condition: FilterQuery<T>): Promise<T> {
    const doc = await this.model.findOne(condition);
    if (doc) return this.populate ? doc.populate(this.populate) : doc;
  }

  async create(createDto: Partial<T>): Promise<T> {
    const data = await this.model.create(createDto);

    return this.populate ? data.populate(this.populate) : data;
  }

  async deleteById(id: string): Promise<T> {
    const doc = await this.model.findById(id);
    await doc.delete();
    return doc;
  }

  async count(filter?: FilterQuery<T>): Promise<number> {
    return await this.model.countDocuments(filter);
  }
}
