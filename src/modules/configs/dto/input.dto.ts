import { IsArray } from 'class-validator';

export class CreateConfig {
  @IsArray()
  blog: string[];
}
