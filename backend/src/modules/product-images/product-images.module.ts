import { Module } from '@nestjs/common';
import { ProductImageController } from './product-images.controller.js';
import { ProductImageService } from './product-images.service.js';

@Module({
  controllers: [ProductImageController],
  providers: [ProductImageService],
  exports: [ProductImageService],
})
export class ProductImageModule {}
