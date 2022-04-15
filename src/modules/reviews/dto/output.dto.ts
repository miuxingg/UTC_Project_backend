import { Exclude, Expose, Type } from 'class-transformer';
import { ClassBase } from 'src/common/BaseDTO';
import { ProfileDto } from 'src/modules/auth/dto/auth.output';

@Exclude()
export class ReviewOutputDto extends ClassBase {
  @Expose()
  @Type(() => ProfileDto)
  user: ProfileDto;

  @Expose()
  comment: string;

  @Expose()
  rating: number;
}
