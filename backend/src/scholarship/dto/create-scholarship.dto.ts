import { IsDateString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateScholarshipDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  amount: string;

  @IsDateString()
  deadline: string;

  @MinLength(20)
  description: string;
}
