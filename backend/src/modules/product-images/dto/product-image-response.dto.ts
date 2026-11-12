import { ApiProperty } from '@nestjs/swagger';

export class ProductImageResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  productId!: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  imageUrl!: string;

  @ApiProperty({
    example: 'Sample',
    maxLength: 255,
    type: String,
    nullable: true,
  })
  altText!: string | null;

  @ApiProperty({ example: 0, minimum: 0 })
  displayOrder!: number;

  @ApiProperty()
  createdAt!: Date;
}
