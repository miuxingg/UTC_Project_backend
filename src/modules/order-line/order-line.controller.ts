import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/libs/decorators/user.decorator';
import { IIAMUser } from 'src/utils/types';
import { AuthService } from '../auth/auth.service';
import { OrderLineInputDto } from './dto/input.dto';
import { OrderLineService } from './order-line.service';

@Controller('order-line')
export class OrderLineController {
  constructor(
    private readonly orderLineService: OrderLineService,
    private readonly userService: AuthService,
  ) {}

  @Post()
  async createOrderLine(@Body() orderLine: OrderLineInputDto) {
    const response = await this.orderLineService.create(orderLine);
    return response;
  }
}
