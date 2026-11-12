import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateBusinessCategoryDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Name must be text' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  @ApiProperty({ example: 'Sample', maxLength: 100 })
  name!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Slug must be text' })
  @IsNotEmpty({ message: 'Slug is required' })
  @MaxLength(120, { message: 'Slug must be at most 120 characters' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug may only contain lowercase letters, numbers and single hyphens (for example: my-shop)',
  })
  @ApiProperty({ example: 'sample-slug', maxLength: 120 })
  slug!: string;

  @IsOptional()
  @IsString({ message: 'Description must be text' })
  @ApiPropertyOptional({ example: 'Some text' })
  description?: string;
}
