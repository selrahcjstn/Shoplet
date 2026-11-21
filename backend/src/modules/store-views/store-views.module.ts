import { Module } from '@nestjs/common';
import { TrackingModule } from '../tracking/tracking.module.js';
import { StoreViewController } from './store-views.controller.js';
import { StoreViewService } from './store-views.service.js';

@Module({
  imports: [TrackingModule],
  controllers: [StoreViewController],
  providers: [StoreViewService],
  exports: [StoreViewService],
})
export class StoreViewModule {}
