import { IsArray, IsOptional, IsString } from 'class-validator';
import { DocumentStatus } from 'src/utils/types';

export class CreateCategoryDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  status: DocumentStatus;
}

export class GetCategoryByIdsDto {
  @IsArray()
  ids: string[];
}
