import { IsMongoId, IsNumber } from 'class-validator';

export class OrderLineInputDto {
  @IsMongoId()
  orderId: string;

  @IsMongoId()
  bookId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

export class OrderLineInputFromOrderDto {
  @IsMongoId()
  bookId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}
