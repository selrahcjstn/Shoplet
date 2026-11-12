import { ApiProperty } from '@nestjs/swagger';

export class AdminActionResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  adminId!: string;

  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
    type: String,
    nullable: true,
  })
  targetUserId!: string | null;

  @ApiProperty({ example: 'SUSPEND_USER', maxLength: 100 })
  action!: string;

  @ApiProperty({ example: 'Some text', type: String, nullable: true })
  reason!: string | null;

  @ApiProperty()
  createdAt!: Date;
}
