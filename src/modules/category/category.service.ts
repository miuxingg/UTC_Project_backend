import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceBase } from 'src/common/ServiceBase';
import { Category, CategoryDocument } from './schema/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/input.dto';

@Injectable()
export class CategoryService extends ServiceBase<CategoryDocument> {
  constructor(
    @InjectModel(Category.name) categoryModel: Model<CategoryDocument>,
  ) {
    super(categoryModel);
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
}
