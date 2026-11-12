import { ApiProperty } from '@nestjs/swagger';

export class ContactClickResponseDto {
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
  productId!: string | null;

  @ApiProperty({ example: 'phone', maxLength: 50 })
  contactType!: string;

  @ApiProperty()
  clickedAt!: Date;
}
