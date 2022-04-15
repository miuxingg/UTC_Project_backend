import { Controller, Get, Post } from '@nestjs/common';
import { SocketsGateway } from '../socket/socket.gateway';
import { EventNames } from '../socket/types/eventName';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(
    private readonly catService: CatsService,
    private readonly socketsGateway: SocketsGateway,
  ) {}

  @Get()
  async getCats() {
    return await this.catService.setCats();
  }

  @Post()
  async createCat() {
    // this.socketsGateway.sendEvent(EventNames.test, { hello: 'world' });
    return {};
  }
}
