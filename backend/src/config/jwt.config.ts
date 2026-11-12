import 'dotenv/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

export function getJwtSecret(): string {
  const secret = process.env['JWT_SECRET'];
  if (!secret || secret.length < 32) {
    throw new Error(
      'JWT_SECRET is missing or too short (min 32 characters). Set it in .env.',
    );
  }
  return secret;
}

export function getJwtOptions(): JwtModuleOptions {
  return {
    secret: getJwtSecret(),
    signOptions: {
      expiresIn: (process.env['JWT_EXPIRES_IN'] ?? '15m') as never,
    },
  };
}
