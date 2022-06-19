import { Exclude, Expose, Type } from 'class-transformer';
import { ClassBase } from 'src/common/BaseDTO';
import { BlogOutpputDto } from 'src/modules/blog/dto/output.dto';

@Exclude()
export class ConfigOutputDto extends ClassBase {
  @Expose()
  @Type(() => BlogOutpputDto)
  blog: string[];

  @Expose()
  shopInfomation: any;

  @Expose()
  shippingMoney: number;
}
