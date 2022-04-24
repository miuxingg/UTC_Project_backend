import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FavoriteOutputDto {
  @Expose()
  user: string;

  @Expose()
  book: string;
}
