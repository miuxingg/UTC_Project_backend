import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { BaseQuery } from 'src/common/BaseDTO';
import { ManagementGuard } from 'src/libs/Guard/management.guard';
import { BlogService } from './blog.service';
import { CreateBlog } from './dto/input.dto';
import { BlogOutpputDto } from './dto/output.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async getAllBlog(@Query() queries: BaseQuery) {
    const [response] = await this.blogService.getAllBlog(queries);
    return {
      items: plainToClass(BlogOutpputDto, response?.items ?? []),
      total: response?.total ?? 0,
    };
  }

  @Post()
  @UseGuards(ManagementGuard)
  async createBlog(@Body() input: CreateBlog) {
    const response = await this.blogService.create({ ...input });
    return plainToClass(BlogOutpputDto, response);
  }
}
