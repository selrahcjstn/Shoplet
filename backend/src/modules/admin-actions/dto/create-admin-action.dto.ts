import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateAdminActionDto {
  @IsOptional()
  @IsUUID('all', { message: 'Target user ID must be a valid ID' })
  @ApiPropertyOptional({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  targetUserId?: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Action must be text' })
  @IsNotEmpty({ message: 'Action is required' })
  @MaxLength(100, { message: 'Action must be at most 100 characters' })
  @ApiProperty({ example: 'SUSPEND_USER', maxLength: 100 })
  action!: string;

  @IsOptional()
  @IsString({ message: 'Reason must be text' })
  @ApiPropertyOptional({ example: 'Some text' })
  reason?: string;
}
