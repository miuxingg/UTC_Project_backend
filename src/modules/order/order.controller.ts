import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { User } from 'src/libs/decorators/user.decorator';
import { IIAMUser } from 'src/utils/types';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../cart/cart.service';
import { OrderLineService } from '../order-line/order-line.service';
import { OrderHistoryQuery, OrderInputDto } from './dto/input.dto';
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
  async getOrderLineByUser(
    @User() iamUser: IIAMUser,
    @Query() queries: OrderHistoryQuery,
  ) {
    const user = await this.userService.findById(iamUser?.id);
    if (!user) return;
    const [response] = await this.orderService.getAllOrderByUser(
      user?.id,
      queries,
    );
    // return response;
    return {
      items: plainToClass(OrderOutputDto, response?.items ?? []),
      total: response?.total ?? 0,
    };
  }

  @Post()
  async createOrder(@User() iamUser: IIAMUser, @Body() data: OrderInputDto) {
    console.log(data);

    const orderResponse = await this.orderService.createOrder(iamUser, data);
    return orderResponse;
    // return plainToClass(OrderOutputDto, order);
  }
}
