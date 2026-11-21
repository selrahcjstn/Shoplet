import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getJwtOptions } from '../../config/jwt.config.js';
import { TrackingTokenService } from './tracking-token.service.js';

@Module({
  imports: [JwtModule.registerAsync({ useFactory: getJwtOptions })],
  providers: [TrackingTokenService],
  exports: [TrackingTokenService],
})
export class TrackingModule {}
