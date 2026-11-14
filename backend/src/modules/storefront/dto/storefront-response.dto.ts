import { ApiProperty } from '@nestjs/swagger';

export class StorefrontShopDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ example: 'Maple & Co.' }) name!: string;
  @ApiProperty({ example: 'maple-and-co' }) slug!: string;
  @ApiProperty({ type: String, nullable: true }) description!: string | null;
  @ApiProperty({ type: String, nullable: true }) logoUrl!: string | null;
  @ApiProperty({ type: String, nullable: true }) coverImageUrl!: string | null;
  @ApiProperty({ type: String, nullable: true, example: '#176B5B' })
  accentColor!: string | null;
  @ApiProperty({ type: String, nullable: true }) announcement!: string | null;
  @ApiProperty({ type: String, nullable: true, example: 'Home goods' })
  businessCategory!: string | null;
  @ApiProperty() isPublished!: boolean;
}

export class StorefrontCategoryDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ example: 'Candles' }) name!: string;
  @ApiProperty({ example: 'candles' }) slug!: string;
}

export class StorefrontImageDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ example: 'https://example.com/mug.jpg' }) imageUrl!: string;
  @ApiProperty({ type: String, nullable: true }) altText!: string | null;
}

export class StorefrontProductDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ format: 'uuid', type: String, nullable: true })
  categoryId!: string | null;
  @ApiProperty({ example: 'Stoneware mug' }) name!: string;
  @ApiProperty({ example: 'stoneware-mug' }) slug!: string;
  @ApiProperty({ type: String, nullable: true }) description!: string | null;
  @ApiProperty({ example: '520.00' }) price!: string;
  @ApiProperty({ example: 'AVAILABLE' }) availability!: string;
  @ApiProperty() isFeatured!: boolean;
  @ApiProperty({ type: StorefrontImageDto, isArray: true })
  images!: StorefrontImageDto[];
}

export class StorefrontContactDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ example: 'whatsapp' }) contactType!: string;
  @ApiProperty({ example: '+63 917 555 0142' }) contactValue!: string;
}

export class StorefrontResponseDto {
  @ApiProperty({ type: StorefrontShopDto }) shop!: StorefrontShopDto;
  @ApiProperty({
    description:
      'True when the shop is a draft and the viewer is its owner or an admin',
  })
  isPreview!: boolean;
  @ApiProperty({
    description: 'True when the viewer owns the shop or is an admin',
  })
  isOwner!: boolean;
  @ApiProperty({ type: StorefrontCategoryDto, isArray: true })
  categories!: StorefrontCategoryDto[];
  @ApiProperty({ type: StorefrontProductDto, isArray: true })
  products!: StorefrontProductDto[];
  @ApiProperty({ type: StorefrontContactDto, isArray: true })
  contacts!: StorefrontContactDto[];
}
