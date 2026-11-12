import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryService } from './product-categories.service.js';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCategoryService],
    }).compile();

    service = module.get<ProductCategoryService>(ProductCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
