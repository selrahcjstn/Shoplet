import { Test, TestingModule } from '@nestjs/testing';
import { ProductImageController } from './product-images.controller.js';
import { ProductImageService } from './product-images.service.js';

describe('ProductImageController', () => {
  let controller: ProductImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductImageController],
      providers: [{ provide: ProductImageService, useValue: {} }],
    }).compile();

    controller = module.get<ProductImageController>(ProductImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
