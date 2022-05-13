import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IAddress } from 'src/modules/address/types/address.type';

export class CredentialDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail({})
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail({})
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateProfileInputDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @IsObject()
  @IsOptional()
  province?: IAddress;

  @IsObject()
  @IsOptional()
  district?: IAddress;

  @IsObject()
  @IsOptional()
  ward?: IAddress;

  @IsString()
  @IsOptional()
  privateHome?: string;
}

export class AccountEmployeelDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail({})
  email: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  roles?: string;
}
