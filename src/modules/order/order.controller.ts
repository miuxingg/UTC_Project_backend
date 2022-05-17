import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { User } from 'src/libs/decorators/user.decorator';
import { ManagementGuard } from 'src/libs/Guard/management.guard';
import { IIAMUser } from 'src/utils/types';
import { AuthService } from '../auth/auth.service';
import { SocketsGateway } from '../socket/socket.gateway';
import { EventNames } from '../socket/types/eventName';
import { OrderHistoryQuery, OrderInputDto } from './dto/input.dto';
import { OrderOutputDto } from './dto/output.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: AuthService,
    private readonly socketsGateway: SocketsGateway,
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

  @Get('/admin-order')
  @UseGuards(ManagementGuard)
  async getOrderLineByAdmin(@Query() queries: OrderHistoryQuery) {
    const [response] = await this.orderService.getAllOrderByAdmin(queries);
    // return response;
    return {
      items: plainToClass(OrderOutputDto, response?.items ?? []),
      total: response?.total ?? 0,
    };
  }

  @Put(':id')
  @UseGuards(ManagementGuard)
  async updateStatusOrder(
    @Param('id') id: string,
    @Body() input: OrderHistoryQuery,
  ) {
    const response = await this.orderService.updateStatusOrder(id, input);
    if (response?.user) {
      const user = await this.userService.findById(response?.user);
      this.socketsGateway.sendEvent(EventNames.UpdateOrderStatus, {
        __to: user?.id,
        id: response?._id,
        status: response?.status,
      });
    }
    return plainToClass(OrderOutputDto, response);
  }

  @Put('/status/:id')
  async userUpdateStatusOrder(
    @User() iamUser: IIAMUser,
    @Param('id') id: string,
    @Body() input: OrderHistoryQuery,
  ) {
    const user = await this.userService.findById(iamUser.id);
    if (!user) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    const response = await this.orderService.updateStatusOrder(id, input);
    const orderUser = await this.userService.findById(response?.user);
    if (orderUser?.id !== user.id) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    return plainToClass(OrderOutputDto, response);
  }

  @Post()
  async createOrder(@User() iamUser: IIAMUser, @Body() data: OrderInputDto) {
    const orderResponse = await this.orderService.createOrder(iamUser, data);
    return orderResponse;
    // return plainToClass(OrderOutputDto, order);
  }
}
