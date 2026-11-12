import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateContactClickDto {
  @IsUUID('all', { message: 'Shop ID must be a valid ID' })
  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  shopId!: string;

  @IsOptional()
  @IsUUID('all', { message: 'Product ID must be a valid ID' })
  @ApiPropertyOptional({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  productId?: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Contact type must be text' })
  @IsNotEmpty({ message: 'Contact type is required' })
  @MaxLength(50, { message: 'Contact type must be at most 50 characters' })
  @ApiProperty({ example: 'phone', maxLength: 50 })
  contactType!: string;
}
