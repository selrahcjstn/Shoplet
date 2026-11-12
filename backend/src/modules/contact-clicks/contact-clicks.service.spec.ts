import { Test, TestingModule } from '@nestjs/testing';
import { ContactClickService } from './contact-clicks.service.js';

describe('ContactClickService', () => {
  let service: ContactClickService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactClickService],
    }).compile();

    service = module.get<ContactClickService>(ContactClickService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
