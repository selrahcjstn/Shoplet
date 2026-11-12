import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsUUID('all', { message: 'Shop ID must be a valid ID' })
  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  shopId!: string;

  @IsOptional()
  @IsUUID('all', { message: 'Category ID must be a valid ID' })
  @ApiPropertyOptional({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  categoryId?: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Name must be text' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(180, { message: 'Name must be at most 180 characters' })
  @ApiProperty({ example: 'Sample', maxLength: 180 })
  name!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Slug must be text' })
  @IsNotEmpty({ message: 'Slug is required' })
  @MaxLength(200, { message: 'Slug must be at most 200 characters' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug may only contain lowercase letters, numbers and single hyphens (for example: my-shop)',
  })
  @ApiProperty({ example: 'sample-slug', maxLength: 200 })
  slug!: string;

  @IsOptional()
  @IsString({ message: 'Description must be text' })
  @ApiPropertyOptional({ example: 'Some text' })
  description?: string;

  @Transform(({ value }) => (typeof value === 'number' ? String(value) : value))
  @Matches(/^\d{1,10}(\.\d{1,2})?$/, {
    message:
      'Price must be a positive number with up to 2 decimal places (for example: 199.00)',
  })
  @ApiProperty({ example: '199.00' })
  price!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Availability must be text' })
  @IsNotEmpty({ message: 'Availability is required' })
  @MaxLength(30, { message: 'Availability must be at most 30 characters' })
  @ApiProperty({ example: 'AVAILABLE', maxLength: 30 })
  availability!: string;

  @IsOptional()
  @IsBoolean({ message: 'Is visible must be true or false' })
  @ApiPropertyOptional({ example: true })
  isVisible?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Is featured must be true or false' })
  @ApiPropertyOptional({ example: true })
  isFeatured?: boolean;
}
