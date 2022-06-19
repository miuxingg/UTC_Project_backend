import { IsArray, IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateConfig {
  @IsArray()
  @IsOptional()
  blog: string[];

  @IsNumber()
  @IsOptional()
  shippingMoney: number;

  @IsObject()
  @IsOptional()
  shopInfomation: any;
}
