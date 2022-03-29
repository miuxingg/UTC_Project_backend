import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

@Exclude()
export class PaginationOutput<T> {
  @Expose() total: number;

  @Expose()
  items: T[];
}

@Exclude()
export class ClassBase {
  @Expose()
  @Transform(({ obj }) => {
    const id = obj['_id'] || obj['id'];
    if (id) return id.toString();
    return undefined;
  })
  id: string;
}

export class PaginationOption {
  @IsNumber({}, { message: 'invalidData' })
  @Type(() => Number)
  @IsOptional()
  @Min(0, { message: 'minProperty' })
  @Max(20, { message: 'maxProperty' })
  limit?: number;

  @IsNumber({}, { message: 'invalidData' })
  @Type(() => Number)
  @IsOptional()
  @Min(0, { message: 'minProperty' })
  offset?: number;
}

export class BaseQuery extends PaginationOption {
  @IsString({ message: 'Invalid' })
  @IsOptional()
  search?: string = '';
}
