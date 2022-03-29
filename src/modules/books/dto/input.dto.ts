import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseQuery } from 'src/common/BaseDTO';
import { BookStatus } from 'src/utils/types';

export class CreateBookDto {
  @IsString()
  name: string;

  @IsMongoId()
  category: string[];

  @IsString()
  author: string;

  @IsString()
  description: string;

  @IsString()
  thumbnail: string;

  @IsString()
  cloudTag: string[];

  @IsNumber()
  price: number;

  @IsNumber()
  priceUnDiscount: number;

  @IsString()
  images: string[];

  @IsNumber()
  quantity: number;

  @IsString()
  status: BookStatus;
}

export class BookQuery extends BaseQuery {
  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  startPrice?: number;

  @IsNumber()
  @IsOptional()
  endPrice?: number;

  @IsString()
  @IsOptional()
  cloudTag?: string;
}

export class BookByIds {
  @IsMongoId()
  @IsOptional()
  ids?: string[];
}
