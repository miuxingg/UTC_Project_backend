import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/input.dto';
import { CartOutputDto } from './dto/output.dto';
import { User } from 'src/libs/decorators/user.decorator';
import { IIAMUser } from 'src/utils/types';
import { AuthService } from '../auth/auth.service';
import { transformValidationMessage } from 'src/utils/helper';
import * as messages from '../resources/errorMessage.json';
import { BaseQuery } from 'src/common/BaseDTO';
import { Types } from 'mongoose';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly userService: AuthService,
  ) {}

  @Get()
  async getAllCart(@User() iamUser: IIAMUser, @Query() query: BaseQuery) {
    const user = await this.userService.findById(iamUser.id);
    if (!user) {
      throw new BadRequestException(
        transformValidationMessage(messages.isNotUser, 'auth', ['User']),
      );
    }
    const [response] = await this.cartService.getAllCart(user.id, query);
    return {
      items: plainToClass(CartOutputDto, response.items || []),
      total: response.total || 0,
    };
  }

  @Delete(':id')
  async removeItem(
    @User() iamUser: IIAMUser,
    @Param('id') id: string,
  ): Promise<any> {
    await this.cartService.deleteById(id);
    return { id };
  }

  @Post()
  async createCart(
    @User() iamUser: IIAMUser,
    @Body() cartCreate: CreateCartDto,
  ) {
    const user = await this.userService.findById(iamUser?.id);
    if (!user) {
      throw new BadRequestException(
        transformValidationMessage(messages.isNotUser, 'auth', ['User']),
      );
    }
    const response = await this.cartService.createItem(cartCreate, user.id);
    return plainToClass(CartOutputDto, response);
  }
}
