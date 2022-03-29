import { Exclude, Expose, Transform } from 'class-transformer';
import { ClassBase } from 'src/common/BaseDTO';
import { transformListIds } from 'src/utils/transformDto';

@Exclude()
export class BookOutputDto extends ClassBase {
  @Expose() name: string;

  @Transform(transformListIds)
  @Expose()
  category: string[];

  @Expose() author: string;

  @Expose() description: string;

  @Expose() price: number;

  @Expose() cloudTag: string[];

  @Expose() thumbnail: string;

  @Expose() images: string[];

  @Expose() quantity: number;

  @Expose() priceUnDiscount: number;

  @Expose() status: string;
}
