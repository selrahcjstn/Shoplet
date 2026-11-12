import { Module } from '@nestjs/common';
import { StoreViewController } from './store-views.controller.js';
import { StoreViewService } from './store-views.service.js';

@Module({
  controllers: [StoreViewController],
  providers: [StoreViewService],
  exports: [StoreViewService],
})
export class StoreViewModule {}
