import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseQuery } from 'src/common/BaseDTO';
import { BookStatus, DocumentStatus } from 'src/utils/types';

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

  @IsString()
  documentStatus: DocumentStatus;

  @IsString()
  summary: string;

  @IsMongoId()
  publishers: string[];
}

export class BookQuery extends BaseQuery {
  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  startPrice?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  endPrice?: number;

  @IsString()
  @IsOptional()
  cloudTag?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class BookByIds {
  @IsOptional()
  ids?: string[];
}
