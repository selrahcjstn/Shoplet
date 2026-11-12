import { Test, TestingModule } from '@nestjs/testing';
import { BusinessCategoryController } from './business-categories.controller.js';
import { BusinessCategoryService } from './business-categories.service.js';

describe('BusinessCategoryController', () => {
  let controller: BusinessCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessCategoryController],
      providers: [{ provide: BusinessCategoryService, useValue: {} }],
    }).compile();

    controller = module.get<BusinessCategoryController>(
      BusinessCategoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
