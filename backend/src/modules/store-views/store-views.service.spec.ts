import { Test, TestingModule } from '@nestjs/testing';
import { TrackingTokenService } from '../tracking/tracking-token.service.js';
import { StoreViewService } from './store-views.service.js';

describe('StoreViewService', () => {
  let service: StoreViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreViewService,
        { provide: TrackingTokenService, useValue: {} },
      ],
    }).compile();

    service = module.get<StoreViewService>(StoreViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
