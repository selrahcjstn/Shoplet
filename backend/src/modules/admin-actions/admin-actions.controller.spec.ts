import { Test, TestingModule } from '@nestjs/testing';
import { AdminActionController } from './admin-actions.controller.js';
import { AdminActionService } from './admin-actions.service.js';

describe('AdminActionController', () => {
  let controller: AdminActionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminActionController],
      providers: [{ provide: AdminActionService, useValue: {} }],
    }).compile();

    controller = module.get<AdminActionController>(AdminActionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
