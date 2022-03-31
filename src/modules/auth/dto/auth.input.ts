import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// export class UserRegister {
//   @Expose()
//   @IsEmail({})
//   email: string;

//   @Expose()
//   @IsString()
//   password: string;
// }

export class CredentialDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail({})
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
