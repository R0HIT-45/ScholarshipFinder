import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApplicationDto {
  @IsNumber()
  @Type(() => Number)
  scholarshipId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;

  @IsNotEmpty()
  studentName: string;

  @IsEmail()
  email: string;

  @MinLength(50)
  essay: string;
}

