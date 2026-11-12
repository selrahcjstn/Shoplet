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
  @IsUUID('all', { message: 'Owner ID must be a valid ID' })
  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  ownerId!: string;

  @IsOptional()
  @IsUUID('all', { message: 'Business category ID must be a valid ID' })
  @ApiPropertyOptional({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  businessCategoryId?: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Name must be text' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(150, { message: 'Name must be at most 150 characters' })
  @ApiProperty({ example: 'Sample', maxLength: 150 })
  name!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Slug must be text' })
  @IsNotEmpty({ message: 'Slug is required' })
  @MaxLength(180, { message: 'Slug must be at most 180 characters' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug may only contain lowercase letters, numbers and single hyphens (for example: my-shop)',
  })
  @ApiProperty({ example: 'sample-slug', maxLength: 180 })
  slug!: string;

  @IsOptional()
  @IsString({ message: 'Description must be text' })
  @ApiPropertyOptional({ example: 'Some text' })
  description?: string;

  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    {
      message: 'Logo URL must be a valid URL starting with http:// or https://',
    },
  )
  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  logoUrl?: string;

  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    {
      message:
        'Cover image URL must be a valid URL starting with http:// or https://',
    },
  )
  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  coverImageUrl?: string;

  @IsOptional()
  @Matches(/^#[0-9a-fA-F]{6}$/, {
    message: 'Accent color must be a hex color such as #3366ff',
  })
  @ApiPropertyOptional({ example: '#3366ff', maxLength: 20 })
  accentColor?: string;

  @IsOptional()
  @IsString({ message: 'Announcement must be text' })
  @ApiPropertyOptional({ example: 'Some text' })
  announcement?: string;

  @IsOptional()
  @IsBoolean({ message: 'Is published must be true or false' })
  @ApiPropertyOptional({ example: true })
  isPublished?: boolean;
}
