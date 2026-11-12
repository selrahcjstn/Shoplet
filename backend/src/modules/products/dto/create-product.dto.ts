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
  @IsUUID()
  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  shopId!: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  categoryId?: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  @ApiProperty({ example: 'Sample', maxLength: 180 })
  name!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(200)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase letters, numbers and hyphens',
  })
  @ApiProperty({ example: 'sample-slug', maxLength: 200 })
  slug!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Some text' })
  description?: string;

  @Matches(/^\d{1,10}(\.\d{1,2})?$/, {
    message: 'price must be a decimal with up to 2 places',
  })
  @ApiProperty({ example: '199.00' })
  price!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @ApiProperty({ example: 'AVAILABLE', maxLength: 30 })
  availability!: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isVisible?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isFeatured?: boolean;
}
