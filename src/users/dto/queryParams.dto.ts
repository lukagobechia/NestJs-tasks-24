import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryParamsDto {
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  page: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  take: number;
}
