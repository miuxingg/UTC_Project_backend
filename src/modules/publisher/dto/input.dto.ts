import { IsString } from 'class-validator';

export class PublisherInputDto {
  @IsString()
  name: string;
}
