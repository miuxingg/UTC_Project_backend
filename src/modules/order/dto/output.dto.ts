import { Exclude, Expose, Type } from 'class-transformer';
import { ClassBase } from 'src/common/BaseDTO';
import { OrderLineOutputDto } from 'src/modules/order-line/dto/output.dto';
import { IShippingMethod } from 'src/utils/types';

@Exclude()
export class OrderOutputDto extends ClassBase {
  @Expose()
  totalMoney: number;

  @Expose()
  discount: number;

  @Expose()
  paymentStatus: string;

  @Expose()
  status: string;

  @Expose()
  shippingMethod: IShippingMethod;

  @Expose()
  @Type(() => OrderLineOutputDto)
  orderLines: OrderLineOutputDto[];

  @Expose()
  createAt: Date;
}
