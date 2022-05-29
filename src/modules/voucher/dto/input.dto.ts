import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class VoucherInputDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  priceDiscound: number;

  @IsDateString()
  @IsOptional()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate: Date;
}

export class VoucherUpdateInput extends VoucherInputDto {
  @IsString()
  @IsOptional()
  documentStatus: string;
}
