import { Test, TestingModule } from '@nestjs/testing';
import { ShopContactService } from './shop-contacts.service.js';

describe('ShopContactService', () => {
  let service: ShopContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopContactService],
    }).compile();

    service = module.get<ShopContactService>(ShopContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
