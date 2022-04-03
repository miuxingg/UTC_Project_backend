import { Exclude, Expose, Type } from 'class-transformer';
import { ClassBase } from 'src/common/BaseDTO';
import { BookOutputInCart } from 'src/modules/books/dto/output.dto';

@Exclude()
export class CartOutputDto extends ClassBase {
  // @Expose()
  // @Transform(({ obj }) => transformId(obj, 'userId'))
  // userId: string;

  @Expose()
  @Type(() => BookOutputInCart)
  item: BookOutputInCart;

  @Expose() quantity: number;
}
