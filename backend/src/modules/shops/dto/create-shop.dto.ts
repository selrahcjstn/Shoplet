import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateShopDto {
  @IsUUID()
  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  ownerId!: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  businessCategoryId?: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({ example: 'Sample', maxLength: 150 })
  name!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(180)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase letters, numbers and hyphens',
  })
  @ApiProperty({ example: 'sample-slug', maxLength: 180 })
  slug!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Some text' })
  description?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  logoUrl?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  coverImageUrl?: string;

  @IsOptional()
  @Matches(/^#[0-9a-fA-F]{6}$/, {
    message: 'accentColor must be a hex color like #3366ff',
  })
  @ApiPropertyOptional({ example: '#3366ff', maxLength: 20 })
  accentColor?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Some text' })
  announcement?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isPublished?: boolean;
}
