import { Module } from '@nestjs/common';
import { ShopController } from './shops.controller.js';
import { ShopService } from './shops.service.js';

@Module({
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
