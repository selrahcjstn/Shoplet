import { Module } from '@nestjs/common';
import { ProductCategoryController } from './product-categories.controller.js';
import { ProductCategoryService } from './product-categories.service.js';

@Module({
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
