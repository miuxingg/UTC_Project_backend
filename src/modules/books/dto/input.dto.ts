import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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

  @IsArray()
  category: string[];

  @IsString()
  author: string;

  @IsString()
  description: string;

  @IsString()
  thumbnail: string;

  @IsArray()
  cloudTag: string[];

  @IsNumber()
  price: number;

  @IsNumber()
  priceUnDiscount: number;

  @IsArray()
  images: string[];

  @IsNumber()
  quantity: number;

  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  documentStatus: DocumentStatus;

  @IsString()
  summary: string;

  @IsArray()
  publishers: string[];

  @IsBoolean()
  isCombo: boolean;

  @IsArray()
  books: string[];
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

export class CheckQuantityBooksInput {
  @IsMongoId()
  bookId?: string;

  @IsNumber()
  quantity?: number;
}

export class UpdateDocumentStatusInput {
  @IsOptional()
  documentStatus: DocumentStatus;
}
