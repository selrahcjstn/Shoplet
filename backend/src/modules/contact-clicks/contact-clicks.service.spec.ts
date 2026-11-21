import { Test, TestingModule } from '@nestjs/testing';
import { TrackingTokenService } from '../tracking/tracking-token.service.js';
import { ContactClickService } from './contact-clicks.service.js';

describe('ContactClickService', () => {
  let service: ContactClickService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactClickService,
        { provide: TrackingTokenService, useValue: {} },
      ],
    }).compile();

    service = module.get<ContactClickService>(ContactClickService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
