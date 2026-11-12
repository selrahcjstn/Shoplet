import { ApiProperty } from '@nestjs/swagger';

export class ShopResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  ownerId!: string;

  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
    type: String,
    nullable: true,
  })
  businessCategoryId!: string | null;

  @ApiProperty({ example: 'Sample', maxLength: 150 })
  name!: string;

  @ApiProperty({ example: 'sample-slug', maxLength: 180 })
  slug!: string;

  @ApiProperty({ example: 'Some text', type: String, nullable: true })
  description!: string | null;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    type: String,
    nullable: true,
  })
  logoUrl!: string | null;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    type: String,
    nullable: true,
  })
  coverImageUrl!: string | null;

  @ApiProperty({
    example: '#3366ff',
    maxLength: 20,
    type: String,
    nullable: true,
  })
  accentColor!: string | null;

  @ApiProperty({ example: 'Some text', type: String, nullable: true })
  announcement!: string | null;

  @ApiProperty({ example: true })
  isPublished!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
