import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.js';
import {
  UploadSignatureDto,
  UploadSignatureResponseDto,
} from './dto/upload-signature.dto.js';
import { UploadsService } from './uploads.service.js';

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
  constructor(private readonly service: UploadsService) {}

  @Post('signature')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a signed request for uploading one photo to Cloudinary',
  })
  @ApiOkResponse({ type: UploadSignatureResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiServiceUnavailableResponse({
    description: 'Cloudinary is not configured',
  })
  signature(
    @Body() dto: UploadSignatureDto,
    @CurrentUser() user: AuthenticatedUser,
  ): UploadSignatureResponseDto {
    return this.service.sign(dto.purpose, user);
  }
}
