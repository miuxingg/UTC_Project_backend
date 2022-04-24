import { IsMongoId } from 'class-validator';

export class FavoriteInputDto {
  @IsMongoId()
  book: string;
}
