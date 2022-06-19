import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EmployeeGuard } from 'src/libs/Guard/employee.guard';
import { ConfigsService } from './configs.service';
import { CreateConfig } from './dto/input.dto';
import { ConfigOutputDto } from './dto/output.dto';

@Controller('configs')
export class ConfigsController {
  constructor(private configService: ConfigsService) {}

  @Get()
  async getConfig() {
    const [response] = await this.configService.getConfig();
    return plainToClass(ConfigOutputDto, response);
  }

  @Post()
  @UseGuards(EmployeeGuard)
  async createConfig(@Body() input: CreateConfig) {
    const data = await this.configService.updateConfig({ ...input });
    return data;
  }
}
