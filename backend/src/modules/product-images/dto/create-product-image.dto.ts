import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductImageDto {
  @IsUUID('all', { message: 'Product ID must be a valid ID' })
  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  productId!: string;

  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    {
      message:
        'Image URL must be a valid URL starting with http:// or https://',
    },
  )
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  imageUrl!: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Alt text must be text' })
  @IsNotEmpty({ message: 'Alt text is required' })
  @MaxLength(255, { message: 'Alt text must be at most 255 characters' })
  @ApiPropertyOptional({ example: 'Sample', maxLength: 255 })
  altText?: string;

  @IsOptional()
  @IsInt({ message: 'Display order must be a whole number' })
  @Min(0, { message: 'Display order cannot be negative' })
  @ApiPropertyOptional({ example: 0, minimum: 0 })
  displayOrder?: number;
}
