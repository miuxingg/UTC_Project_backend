import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { BaseQuery } from 'src/common/BaseDTO';
import { ManagementGuard } from 'src/libs/Guard/management.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto, GetCategoryByIdsDto } from './dto/input.dto';
import { CategoryOutput } from './dto/output.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategory(@Query() queries?: BaseQuery) {
    const [response] = await this.categoryService.getAllCategories(queries);
    return {
      items: plainToClass(CategoryOutput, response.items ?? []),
      total: response.total ?? 0,
    };
  }

  @Get('/admin')
  @UseGuards(ManagementGuard)
  async getAllCategoryByAdmin(@Query() queries?: BaseQuery) {
    const [response] = await this.categoryService.getAllCategoriesByAdmin(
      queries,
    );
    return {
      items: plainToClass(CategoryOutput, response.items ?? []),
      total: response.total ?? 0,
    };
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    const response = await this.categoryService.findById(id);
    return plainToClass(CategoryOutput, response);
  }

  @Post('/categoryByIds')
  async getCategoryByIds(@Body() data: GetCategoryByIdsDto) {
    const response = await this.categoryService.getCategoriesByIds(data.ids);
    return plainToClass(CategoryOutput, response ?? []);
  }

  @Post()
  @UseGuards(ManagementGuard)
  async createCategory(@Body() category: CreateCategoryDto) {
    const data = await this.categoryService.createCategory(category);
    return plainToClass(CategoryOutput, data);
  }

  @Put(':id')
  @UseGuards(ManagementGuard)
  async updateCategory(
    @Param('id') id: string,
    @Body() input: CreateCategoryDto,
  ) {
    const data = await this.categoryService.updateCategory(id, input);
    return plainToClass(CategoryOutput, data);
  }

  @Put('/status/:id')
  @UseGuards(ManagementGuard)
  async deleteCategory(
    @Param('id') id: string,
    @Body() input: CreateCategoryDto,
  ) {
    const data = await this.categoryService.updateStatusPublisher(id, input);
    return plainToClass(CategoryOutput, data);
  }
}
