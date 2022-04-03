import { Exclude, Expose, Type } from 'class-transformer';
import { ClassBase } from 'src/common/BaseDTO';
import { CategoryOutput } from 'src/modules/category/dto/output.dto';

@Exclude()
export class BookOutputDto extends ClassBase {
  @Expose() name: string;

  // @Transform(transformListIds)
  @Expose()
  @Type(() => CategoryOutput)
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

@Exclude()
export class BookOutputInCart extends ClassBase {
  @Expose() name: string;

  @Expose() thumbnail: string;

  @Expose() priceUnDiscount: number;

  @Expose() price: number;
}
