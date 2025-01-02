import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FilterUsersDto {
  @IsNumber()
  @IsOptional()
  age: number;

  @IsNumber()
  @IsOptional()
  ageFrom: number;

  @IsNumber()
  @IsOptional()
  ageTo: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  page: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  take: number;
}
