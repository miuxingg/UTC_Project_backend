import { Exclude, Expose } from 'class-transformer';
import { ClassBase } from 'src/common/BaseDTO';

@Exclude()
export class BlogOutpputDto extends ClassBase {
  @Expose() title: string;

  @Expose() content: string;

  @Expose() documentStatus: string;

  @Expose() createdAt: Date;
}
