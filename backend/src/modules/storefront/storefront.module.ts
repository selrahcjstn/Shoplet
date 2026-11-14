import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getJwtOptions } from '../../config/jwt.config.js';
import { StorefrontController } from './storefront.controller.js';
import { StorefrontService } from './storefront.service.js';

@Module({
  imports: [JwtModule.registerAsync({ useFactory: getJwtOptions })],
  controllers: [StorefrontController],
  providers: [StorefrontService],
})
export class StorefrontModule {}
