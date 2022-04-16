import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { BaseQuery } from 'src/common/BaseDTO';
import { PublisherSeedData } from 'src/seed/publisher';
import { PublisherInputDto } from './dto/input.dto';
import { PublisherOutputDto } from './dto/output.dto';
import { PublisherService } from './publisher.service';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get()
  async getAllPublisher(@Param() queries: BaseQuery) {
    const [response] = await this.publisherService.getAllPublisher(queries);
    return {
      items: plainToClass(PublisherOutputDto, response?.items ?? []),
      total: response?.total ?? 0,
    };
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
  async createPublisher(@Body() publisher: PublisherInputDto) {
    const data = await this.publisherService.create({ ...publisher });
    return plainToClass(PublisherOutputDto, data);
  }
}
