import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}
