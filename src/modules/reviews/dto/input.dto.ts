import { IsMongoId, IsNumber, IsString } from 'class-validator';

export class ReviewInputDto {
  @IsMongoId()
  bookId: string;

  @IsString()
  comment: string;

  @IsNumber()
  rating: number;
}
