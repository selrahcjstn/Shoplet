import { Test, TestingModule } from '@nestjs/testing';
import { ContactClickController } from './contact-clicks.controller.js';
import { ContactClickService } from './contact-clicks.service.js';

describe('ContactClickController', () => {
  let controller: ContactClickController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactClickController],
      providers: [{ provide: ContactClickService, useValue: {} }],
    }).compile();

    controller = module.get<ContactClickController>(ContactClickController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
