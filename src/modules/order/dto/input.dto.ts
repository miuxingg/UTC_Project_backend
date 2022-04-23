import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { BaseQuery } from 'src/common/BaseDTO';
import { OrderLineInputFromOrderDto } from 'src/modules/order-line/dto/input.dto';
import { IOrderStatus, IShippingMethod } from 'src/utils/types';

export class OrderInputDto {
  @IsNumber()
  totalMoney: number;

  @IsNumber()
  discount: number;

  @IsString()
  paymentMethod: string;

  @IsObject()
  shippingMethod: IShippingMethod;

  @IsString()
  status: string;

  @IsString()
  paymentStatus: string;

  @IsArray()
  orderLines: OrderLineInputFromOrderDto[];
}

export class OrderHistoryQuery extends BaseQuery {
  @IsString()
  status: IOrderStatus;
}
