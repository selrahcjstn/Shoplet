import { Module } from '@nestjs/common';
import { TrackingModule } from '../tracking/tracking.module.js';
import { ContactClickController } from './contact-clicks.controller.js';
import { ContactClickService } from './contact-clicks.service.js';

@Module({
  imports: [TrackingModule],
  controllers: [ContactClickController],
  providers: [ContactClickService],
  exports: [ContactClickService],
})
export class ContactClickModule {}
