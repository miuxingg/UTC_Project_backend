import { Body, Controller, Get, Post } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CategoryService } from './category.service';
import { CreateCategoryDto, GetCategoryByIdsDto } from './dto/input.dto';
import { CategoryOutput } from './dto/output.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategory() {
    const response = await this.categoryService.findAll();
    return {
      items: plainToClass(CategoryOutput, response.items ?? []),
      total: response.total ?? 0,
    };
    // return await this.categoryService.getAllCategory();
  }

  @Post('/categoryByIds')
  async getCategoryByIds(@Body() data: GetCategoryByIdsDto) {
    const response = await this.categoryService.getCategoriesByIds(data.ids);
    return plainToClass(CategoryOutput, response ?? []);
  }

  @Post()
  async createCategory(@Body() category: CreateCategoryDto) {
    return await this.categoryService.createCategory(category);
  }
}
