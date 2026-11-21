import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateStoreViewDto {
  @IsUUID('all', { message: 'Shop ID must be a valid ID' })
  @ApiProperty({
    format: 'uuid',
    example: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  })
  shopId!: string;

  @IsString({ message: 'Tracking token must be text' })
  @IsNotEmpty({ message: 'Tracking token is required' })
  @ApiProperty({
    description:
      'The trackingToken from GET /storefront/:slug. Counts without a valid token are refused.',
  })
  trackingToken!: string;
}
