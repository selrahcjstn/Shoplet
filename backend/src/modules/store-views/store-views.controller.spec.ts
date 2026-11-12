import { Test, TestingModule } from '@nestjs/testing';
import { StoreViewController } from './store-views.controller.js';
import { StoreViewService } from './store-views.service.js';

describe('StoreViewController', () => {
  let controller: StoreViewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreViewController],
      providers: [{ provide: StoreViewService, useValue: {} }],
    }).compile();

    controller = module.get<StoreViewController>(StoreViewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
