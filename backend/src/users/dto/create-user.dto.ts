import { IsEmail, IsIn, IsNotEmpty, MinLength } from 'class-validator';
import type { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsIn(['user', 'admin'])
  role: UserRole = 'user';
}

