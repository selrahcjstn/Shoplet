import { Module } from '@nestjs/common';
import { ShopContactController } from './shop-contacts.controller.js';
import { ShopContactService } from './shop-contacts.service.js';

@Module({
  controllers: [ShopContactController],
  providers: [ShopContactService],
  exports: [ShopContactService],
})
export class ShopContactModule {}
