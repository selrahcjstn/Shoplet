import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export const UPLOAD_PURPOSES = ['product', 'logo', 'cover'] as const;
export type UploadPurpose = (typeof UPLOAD_PURPOSES)[number];

export class UploadSignatureDto {
  @IsIn(UPLOAD_PURPOSES, {
    message: 'Purpose must be one of: product, logo, cover',
  })
  @ApiProperty({ enum: UPLOAD_PURPOSES, example: 'product' })
  purpose!: UploadPurpose;
}

export class UploadSignatureResponseDto {
  @ApiProperty({
    example: 'https://api.cloudinary.com/v1_1/demo/image/upload',
  })
  uploadUrl!: string;

  @ApiProperty({
    description:
      'Send every field with the file, unchanged, as multipart form data to uploadUrl',
    example: {
      api_key: '123456789012345',
      timestamp: '1794638532',
      folder: 'shoplet/<user id>/product',
      allowed_formats: 'jpg,jpeg,png,webp',
      signature: 'a1b2c3...',
    },
  })
  params!: Record<string, string>;
}
