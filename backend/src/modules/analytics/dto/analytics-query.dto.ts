import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class AnalyticsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Days must be a whole number' })
  @Min(1, { message: 'Days must be at least 1' })
  @Max(365, { message: 'Days must be at most 365' })
  @ApiPropertyOptional({ example: 30, minimum: 1, maximum: 365, default: 30 })
  days?: number;

  @IsOptional()
  @IsString({ message: 'Timezone must be text' })
  @MaxLength(64, { message: 'Timezone must be at most 64 characters' })
  @ApiPropertyOptional({
    example: 'Asia/Manila',
    description:
      'IANA timezone used to decide where each day starts. Default UTC.',
  })
  timezone?: string;
}
