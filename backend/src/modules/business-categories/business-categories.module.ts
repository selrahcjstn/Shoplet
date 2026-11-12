import { Module } from '@nestjs/common';
import { BusinessCategoryController } from './business-categories.controller.js';
import { BusinessCategoryService } from './business-categories.service.js';

@Module({
  controllers: [BusinessCategoryController],
  providers: [BusinessCategoryService],
  exports: [BusinessCategoryService],
})
export class BusinessCategoryModule {}
