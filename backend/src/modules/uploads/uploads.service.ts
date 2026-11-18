import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.js';
import type {
  UploadPurpose,
  UploadSignatureResponseDto,
} from './dto/upload-signature.dto.js';

const ALLOWED_FORMATS = 'jpg,jpeg,png,webp';

/**
 * Cloudinary's signing rule: sort the parameters by name, join them as a=1&b=2,
 * append the API secret, and take the SHA-1 hex digest.
 */
export function signParams(
  params: Record<string, string>,
  secret: string,
): string {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return createHash('sha1')
    .update(payload + secret)
    .digest('hex');
}

/**
 * Lets the browser upload a photo straight to Cloudinary without ever seeing the API secret.
 * Each signature is tied to one folder and to image formats only, and Cloudinary rejects it
 * after an hour.
 */
@Injectable()
export class UploadsService {
  sign(
    purpose: UploadPurpose,
    user: AuthenticatedUser,
  ): UploadSignatureResponseDto {
    const cloudName = process.env['CLOUDINARY_CLOUD_NAME'];
    const apiKey = process.env['CLOUDINARY_API_KEY'];
    const secret = process.env['CLOUDINARY_API_SECRET'];
    if (!cloudName || !apiKey || !secret) {
      throw new ServiceUnavailableException(
        'Photo uploads are not set up yet. Paste an image link instead.',
      );
    }

    const params = {
      timestamp: String(Math.floor(Date.now() / 1000)),
      // One folder per seller keeps their photos together and easy to clean up.
      folder: `shoplet/${user.id}/${purpose}`,
      allowed_formats: ALLOWED_FORMATS,
    };

    return {
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      params: {
        ...params,
        api_key: apiKey,
        signature: signParams(params, secret),
      },
    };
  }
}
