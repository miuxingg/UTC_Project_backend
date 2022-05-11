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
import { PublisherSeedData } from 'src/seed/publisher';
import { PublisherInputDto } from './dto/input.dto';
import { PublisherOutputDto } from './dto/output.dto';
import { PublisherService } from './publisher.service';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get()
  async getAllPublisher(@Query() queries?: BaseQuery) {
    const [response] = await this.publisherService.getAllPublisher(queries);
    return {
      items: plainToClass(PublisherOutputDto, response?.items ?? []),
      total: response?.total ?? 0,
    };
  }

  @Get(':id')
  async getPublisherById(@Param('id') id: string) {
    const response = await this.publisherService.findById(id);
    return plainToClass(PublisherOutputDto, response);
  }

  @Get('seed')
  async seedDataPublisher() {
    const dataPromise = PublisherSeedData.map(async (item) => {
      return await this.publisherService.create(item);
    });
    const data = await Promise.all(dataPromise);
    return data;
  }

  @Post()
  @UseGuards(ManagementGuard)
  async createPublisher(@Body() publisher: PublisherInputDto) {
    const data = await this.publisherService.create({ ...publisher });
    return plainToClass(PublisherOutputDto, data);
  }

  @Put(':id')
  @UseGuards(ManagementGuard)
  async updatePublisher(
    @Param('id') id: string,
    @Body() input: PublisherInputDto,
  ) {
    const data = await this.publisherService.updatePublisher(id, input);
    return plainToClass(PublisherOutputDto, data);
  }

  @Put('/status/:id')
  @UseGuards(ManagementGuard)
  async deleteCategory(
    @Param('id') id: string,
    @Body() input: PublisherInputDto,
  ) {
    const data = await this.publisherService.updateStatusPublisher(id, input);
    return plainToClass(PublisherOutputDto, data);
  }
}
