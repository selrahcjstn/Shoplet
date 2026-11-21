import { Test, TestingModule } from '@nestjs/testing';
import { TrackingTokenService } from '../tracking/tracking-token.service.js';
import { ProductViewService } from './product-views.service.js';

describe('ProductViewService', () => {
  let service: ProductViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductViewService,
        { provide: TrackingTokenService, useValue: {} },
      ],
    }).compile();

    service = module.get<ProductViewService>(ProductViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
