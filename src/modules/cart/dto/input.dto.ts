import { Type } from 'class-transformer';
import { IsMongoId, IsNumber } from 'class-validator';

export class CreateCartDto {
  @IsMongoId()
  bookId: string;

  @IsNumber()
  @Type(() => Number)
  quantity: number;
}
