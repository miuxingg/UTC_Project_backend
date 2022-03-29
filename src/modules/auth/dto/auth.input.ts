import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class UserRegister {
  @Expose()
  @IsEmail({})
  email: string;

  @Expose()
  @IsString()
  password: string;
}
