import { Module } from '@nestjs/common';
import { ContactClickController } from './contact-clicks.controller.js';
import { ContactClickService } from './contact-clicks.service.js';

@Module({
  controllers: [ContactClickController],
  providers: [ContactClickService],
  exports: [ContactClickService],
})
export class ContactClickModule {}
