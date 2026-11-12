import { ApiProperty } from '@nestjs/swagger';

export class ShopContactResponseDto {
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

  @ApiProperty({ example: 'phone', maxLength: 50 })
  contactType!: string;

  @ApiProperty({ example: '+639171234567', maxLength: 255 })
  contactValue!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
