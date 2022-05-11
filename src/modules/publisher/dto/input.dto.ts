import { IsOptional, IsString } from 'class-validator';
import { DocumentStatus } from 'src/utils/types';

export class PublisherInputDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  status: DocumentStatus;
}
