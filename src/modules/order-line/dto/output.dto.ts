import { Exclude, Expose, Type } from 'class-transformer';
import { ClassBase } from 'src/common/BaseDTO';
import { BookOutputDto } from 'src/modules/books/dto/output.dto';

@Exclude()
export class OrderLineOutputDto extends ClassBase {
  @Expose()
  price: number;

  @Expose()
  quantity: number;

  @Expose()
  @Type(() => BookOutputDto)
  book: BookOutputDto;
}
