import { Module } from '@nestjs/common';
import { AdminActionController } from './admin-actions.controller.js';
import { AdminActionService } from './admin-actions.service.js';

@Module({
  controllers: [AdminActionController],
  providers: [AdminActionService],
  exports: [AdminActionService],
})
export class AdminActionModule {}
