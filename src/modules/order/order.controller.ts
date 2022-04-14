import { Body, Controller, Get, Post } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { User } from 'src/libs/decorators/user.decorator';
import { IIAMUser } from 'src/utils/types';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../cart/cart.service';
import { OrderLineService } from '../order-line/order-line.service';
import { OrderInputDto } from './dto/input.dto';
import { OrderOutputDto } from './dto/output.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: AuthService,
    private readonly orderLineService: OrderLineService,
    private readonly cartService: CartService,
  ) {}

  @Get()
  async getOrderLineByUser(@User() iamUser: IIAMUser) {
    const user = await this.userService.findById(iamUser?.id);
    const [response] = await this.orderService.getAllOrderByUser(user?.id);
    // return response;
    return plainToClass(OrderOutputDto, response);
  }

  @Post()
  async createOrder(@User() iamUser: IIAMUser, @Body() data: OrderInputDto) {
    const orderResponse = await this.orderService.createOrder(iamUser, data);
    return orderResponse;
    // return plainToClass(OrderOutputDto, order);
  }
}
