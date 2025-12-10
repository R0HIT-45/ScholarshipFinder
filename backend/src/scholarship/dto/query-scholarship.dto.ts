import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryScholarshipDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['title', 'deadline', 'amount', 'createdAt'])
  sortBy?: 'title' | 'deadline' | 'amount' | 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  limit?: number = 20;
}

