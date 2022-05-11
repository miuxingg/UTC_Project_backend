import { Exclude, Expose } from 'class-transformer';
import { ClassBase } from 'src/common/BaseDTO';
import { DocumentStatus } from 'src/utils/types';

@Exclude()
export class CategoryOutput extends ClassBase {
  @Expose() name: string;
  @Expose() status: DocumentStatus;
}
