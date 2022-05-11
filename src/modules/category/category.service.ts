import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceBase } from 'src/common/ServiceBase';
import { Category, CategoryDocument } from './schema/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/input.dto';
import { BaseQuery } from 'src/common/BaseDTO';
import { aggregateQuery } from 'src/common/Aggregate';

@Injectable()
export class CategoryService extends ServiceBase<CategoryDocument> {
  constructor(
    @InjectModel(Category.name) categoryModel: Model<CategoryDocument>,
  ) {
    super(categoryModel);
  }

  async getAllCategories(queries?: BaseQuery) {
    const match = {};
    if (queries && queries?.search) {
      match['$text'] = { $search: queries.search };
    }
    return await this.model.aggregate([
      { $match: match },
      { $sort: { _id: -1 } },
      ...aggregateQuery(queries),
    ]);
  }

  async createCategory(category: CreateCategoryDto) {
    return this.model.create(category);
  }

  async getCategoriesByIds(ids?: string[]) {
    if (ids) {
      const list = ids.map(async (item) => {
        return await this.findById(item);
      });
      const data = Promise.all(list);
      return data;
    }
    return [];
  }

  async updateCategory(id: string, input: CreateCategoryDto) {
    const category = await this.model.findById(id);
    if (!category) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    category.name = input.name;
    await category.save();
    return category;
  }

  async updateStatusPublisher(id: string, input: CreateCategoryDto) {
    const publisher = await this.model.findById(id);
    if (!publisher) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    publisher.status = input.status;
    await publisher.save();
    return publisher;
  }
}
