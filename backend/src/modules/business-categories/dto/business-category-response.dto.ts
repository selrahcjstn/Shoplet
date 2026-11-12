import { ApiProperty } from '@nestjs/swagger';

export class BusinessCategoryResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  id!: string;

  @ApiProperty({ example: 'Sample', maxLength: 100 })
  name!: string;

  @ApiProperty({ example: 'sample-slug', maxLength: 120 })
  slug!: string;

  @ApiProperty({ example: 'Some text', type: String, nullable: true })
  description!: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
