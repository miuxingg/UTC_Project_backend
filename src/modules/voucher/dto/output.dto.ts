import { Exclude, Expose } from 'class-transformer';
import { ClassBase } from 'src/common/BaseDTO';

@Exclude()
export class VoucherOutputDto extends ClassBase {
  @Expose()
  name: string;

  @Expose()
  priceDiscound: number;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose() documentStatus: string;
}
