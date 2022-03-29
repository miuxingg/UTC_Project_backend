import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { BooksService } from './books.service';
import { BookByIds, BookQuery, CreateBookDto } from './dto/input.dto';
import { BookOutputDto } from './dto/output.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Get()
  async getBooks(@Query() queries?: BookQuery) {
    const [response] = await this.bookService.getAllBook(queries);
    const data = {
      items: plainToClass(BookOutputDto, response?.items ?? []),
      total: response?.total ?? 0,
    };
    return data;
  }

  @Get('cloudtag')
  async getCloudTag() {
    const response = await this.bookService.getCloudTags();
    return {
      items: response,
      total: response.length,
    };
  }

  @Get('ids')
  async getBookByIds(@Query() query: BookByIds) {
    const [response] = await this.bookService.getBookByIds(
      JSON.parse(String(query.ids)),
    );
    return {
      items: plainToClass(BookOutputDto, response.items ?? []),
      total: response.total ?? 0,
    };
  }

  @Get(':id')
  async getBookById(@Param('id') idBook: string) {
    const response = await this.bookService.getBookById(idBook);
    const data = plainToClass(BookOutputDto, response);
    return data;
  }

  @Post()
  async createBook(@Body() createBook: CreateBookDto) {
    const response = await this.bookService.createBook(createBook);
    const data = plainToClass(BookOutputDto, response);
    return data;
  }
}
