import { ServiceUnavailableException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { UploadsService, signParams } from './uploads.service.js';

const seller = { id: 'seller-1', role: 'SELLER' as const };
const ENV = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];
const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const key of ENV) saved[key] = process.env[key];
  process.env['CLOUDINARY_CLOUD_NAME'] = 'demo';
  process.env['CLOUDINARY_API_KEY'] = '123456789012345';
  process.env['CLOUDINARY_API_SECRET'] = 'test-secret';
});

afterEach(() => {
  for (const key of ENV) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

describe('signParams', () => {
  it('follows the Cloudinary rule: sorted pairs, then the secret, SHA-1', () => {
    const expected = createHash('sha1')
      .update('folder=x&timestamp=10' + 'abc')
      .digest('hex');
    // Given out of order on purpose.
    expect(signParams({ timestamp: '10', folder: 'x' }, 'abc')).toBe(expected);
  });
});

describe('UploadsService.sign', () => {
  const service = new UploadsService();

  it('returns the upload URL and every field the browser must send', () => {
    const result = service.sign('product', seller);

    expect(result.uploadUrl).toBe(
      'https://api.cloudinary.com/v1_1/demo/image/upload',
    );
    expect(result.params).toMatchObject({
      api_key: '123456789012345',
      folder: 'shoplet/seller-1/product',
      allowed_formats: 'jpg,jpeg,png,webp',
    });
    expect(result.params['timestamp']).toMatch(/^\d+$/);
  });

  it('signs the checked fields and never includes the secret', () => {
    const { params } = service.sign('logo', seller);
    const { signature, api_key: _key, ...signed } = params;
    expect(signature).toBe(signParams(signed, 'test-secret'));
    expect(JSON.stringify(params)).not.toContain('test-secret');
  });

  it('refuses with a clear message when Cloudinary is not configured', () => {
    delete process.env['CLOUDINARY_API_KEY'];
    expect(() => service.sign('cover', seller)).toThrow(
      ServiceUnavailableException,
    );
  });
});
