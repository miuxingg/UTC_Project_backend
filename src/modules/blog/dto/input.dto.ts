import { IsOptional, IsString } from 'class-validator';

export class CreateBlog {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  documentStatus: string;

  @IsString()
  image: string;
}
