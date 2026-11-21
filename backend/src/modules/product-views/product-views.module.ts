import { Module } from '@nestjs/common';
import { TrackingModule } from '../tracking/tracking.module.js';
import { ProductViewController } from './product-views.controller.js';
import { ProductViewService } from './product-views.service.js';

@Module({
  imports: [TrackingModule],
  controllers: [ProductViewController],
  providers: [ProductViewService],
  exports: [ProductViewService],
})
export class ProductViewModule {}
