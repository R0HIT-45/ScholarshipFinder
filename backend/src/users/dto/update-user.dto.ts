import { IsIn, IsOptional, IsString } from 'class-validator';
import type { UserRole } from '../user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: UserRole;
}

