import { Exclude, Expose } from 'class-transformer';
import { ClassBase } from 'src/common/BaseDTO';
import { IAddress } from 'src/modules/address/types/address.type';
@Exclude()
export class Authenticated {
  @Expose() access_token: string;
  @Expose() refresh_token: string;
  @Expose() expires_in: number;
  @Expose() refresh_expires_in: number;
}

@Exclude()
export class ResponseDto {
  @Expose() statusCode: number;
  @Expose() message: string;
  @Expose() field?: string;
}

@Exclude()
export class ProfileDto extends ClassBase {
  @Expose() firstName?: string;
  @Expose() lastName?: string;
  @Expose() email?: string;
  @Expose() avatar?: string;
  @Expose() phoneNumber?: string;
  @Expose() dateOfBirth?: string;
  @Expose() province?: IAddress;
  @Expose() district?: IAddress;
  @Expose() ward?: IAddress;
  @Expose() privateHome?: string;
  @Expose() roles?: string;
}

@Exclude()
export class EmployeOutputDto extends ClassBase {
  @Expose() email?: string;
  @Expose() roles?: string;
  @Expose() firstName?: string;
  @Expose() lastName?: string;
  @Expose() avatar?: string;
}
