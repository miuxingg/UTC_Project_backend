import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { OrderLineInputDto } from './dto/input.dto';
import { OrderLineService } from './order-line.service';

@Controller('order-line')
export class OrderLineController {
  constructor(
    private readonly orderLineService: OrderLineService,
    private readonly userService: AuthService,
  ) {}

  @Get('/best-saler')
  async getBestSaler() {
    const data = await this.orderLineService.bookBestSaler();
    return data;
  }

  @Post()
  async createOrderLine(@Body() orderLine: OrderLineInputDto) {
    const response = await this.orderLineService.create(orderLine);
    return response;
  }
}
