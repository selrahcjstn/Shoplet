import { Test, TestingModule } from '@nestjs/testing';
import { ProductViewController } from './product-views.controller.js';
import { ProductViewService } from './product-views.service.js';

describe('ProductViewController', () => {
  let controller: ProductViewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductViewController],
      providers: [{ provide: ProductViewService, useValue: {} }],
    }).compile();

    controller = module.get<ProductViewController>(ProductViewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
