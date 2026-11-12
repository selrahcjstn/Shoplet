import { Module } from '@nestjs/common';
import { ProductViewController } from './product-views.controller.js';
import { ProductViewService } from './product-views.service.js';

@Module({
  controllers: [ProductViewController],
  providers: [ProductViewService],
  exports: [ProductViewService],
})
export class ProductViewModule {}
