import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { response } from 'express';
import { PaginationOutput } from 'src/common/BaseDTO';
import { User } from 'src/libs/decorators/user.decorator';
import { BooksSeed } from 'src/seed/book';
import { IIAMUser } from 'src/utils/types';
import { AuthService } from '../auth/auth.service';
import { BooksService } from './books.service';
import {
  BookByIds,
  BookQuery,
  CheckQuantityBooksInput,
  CreateBookDto,
} from './dto/input.dto';
import { BookOutputDto, CheckBookQuantity } from './dto/output.dto';

@Controller('books')
export class BooksController {
  constructor(
    private readonly bookService: BooksService,
    private readonly userService: AuthService,
  ) {}

  @Get()
  async getBooks(@User() iamUser: IIAMUser, @Query() queries?: BookQuery) {
    const user = await this.userService.findById(iamUser?.id);
    const [response] = await this.bookService.getAllBook(queries, user?.id);
    const data = {
      items: plainToClass(BookOutputDto, response?.items ?? []),
      total: response?.total ?? 0,
    };
    return data;
    // return response;
  }

  @Get('seed')
  async bookSeedData() {
    const dataPromise = BooksSeed.map(async (item) => {
      return await this.bookService.create(item);
    });
    const data = await Promise.all(dataPromise);
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
  async getBookByIds(@User() iamUser: IIAMUser, @Query() query: BookByIds) {
    const user = await this.userService.findById(iamUser?.id);
    const [response] = await this.bookService.getBookByIds(
      JSON.parse(String(query.ids)),
      user?.id,
    );
    return {
      items: plainToClass(BookOutputDto, response?.items ?? []),
      total: response.total ?? 0,
    };
  }

  @Get('/best-saler')
  async getBookBestSaler(): Promise<PaginationOutput<BookOutputDto>> {
    const data = await this.bookService.getBookBestSaler();
    return {
      items: plainToClass(BookOutputDto, data?.items ?? []),
      total: data?.total ?? 0,
    };
  }

  @Get(':id')
  async getBookById(@User() iamUser: IIAMUser, @Param('id') idBook: string) {
    const user = await this.userService.findById(iamUser?.id);

    const [response] = await this.bookService.getBookById(idBook, user?.id);
    const data = plainToClass(BookOutputDto, response);
    return data;
    // return response;
  }

  @Post('check-quantity')
  async checkQuantity(@Body() res: CheckQuantityBooksInput[]) {
    const response = await this.bookService.checkQuantityListBooks(res);
    return plainToClass(CheckBookQuantity, response ?? []);
  }

  @Post()
  async createBook(@Body() createBook: CreateBookDto) {
    console.log(createBook);

    const response = await this.bookService.createBook({ ...createBook });
    const data = plainToClass(BookOutputDto, response);
    return data;
  }
}
