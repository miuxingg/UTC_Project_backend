import { Exclude, Expose } from 'class-transformer';
import { ClassBase } from 'src/common/BaseDTO';

@Exclude()
export class CategoryOutput extends ClassBase {
  @Expose() name: string;
}
