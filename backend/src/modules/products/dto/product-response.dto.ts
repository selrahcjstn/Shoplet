import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  shopId!: string;

  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
    type: String,
    nullable: true,
  })
  categoryId!: string | null;

  @ApiProperty({ example: 'Sample', maxLength: 180 })
  name!: string;

  @ApiProperty({ example: 'sample-slug', maxLength: 200 })
  slug!: string;

  @ApiProperty({ example: 'Some text', type: String, nullable: true })
  description!: string | null;

  @ApiProperty({ example: '199.00' })
  price!: string;

  @ApiProperty({ example: 'AVAILABLE', maxLength: 30 })
  availability!: string;

  @ApiProperty({ example: true })
  isVisible!: boolean;

  @ApiProperty({ example: true })
  isFeatured!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
