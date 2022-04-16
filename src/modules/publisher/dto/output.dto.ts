import { Exclude, Expose } from 'class-transformer';
import { ClassBase } from 'src/common/BaseDTO';

@Exclude()
export class PublisherOutputDto extends ClassBase {
  @Expose()
  name: string;
}
