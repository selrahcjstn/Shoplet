import { Test, TestingModule } from '@nestjs/testing';
import { ShopContactController } from './shop-contacts.controller.js';
import { ShopContactService } from './shop-contacts.service.js';

describe('ShopContactController', () => {
  let controller: ShopContactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopContactController],
      providers: [{ provide: ShopContactService, useValue: {} }],
    }).compile();

    controller = module.get<ShopContactController>(ShopContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
