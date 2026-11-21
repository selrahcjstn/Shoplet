import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getJwtOptions } from '../../config/jwt.config.js';
import { TrackingModule } from '../tracking/tracking.module.js';
import { StorefrontController } from './storefront.controller.js';
import { StorefrontService } from './storefront.service.js';

@Module({
  imports: [
    JwtModule.registerAsync({ useFactory: getJwtOptions }),
    TrackingModule,
  ],
  controllers: [StorefrontController],
  providers: [StorefrontService],
})
export class StorefrontModule {}
