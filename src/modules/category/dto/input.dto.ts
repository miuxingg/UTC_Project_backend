import { IsArray, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;
}

export class GetCategoryByIdsDto {
  @IsArray()
  ids: string[];
}
