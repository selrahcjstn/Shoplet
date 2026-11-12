import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController', () => {
  let controller: UsersController;
  const usersService = { findById: vi.fn(), update: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getMe uses the id from request.user', async () => {
    usersService.findById.mockResolvedValue({ id: 'u1' });
    await controller.getMe({ id: 'u1', role: 'SELLER' });
    expect(usersService.findById).toHaveBeenCalledWith('u1');
  });

  it('updateMe uses the id from request.user', async () => {
    usersService.update.mockResolvedValue({ id: 'u1' });
    await controller.updateMe({ id: 'u1', role: 'SELLER' }, { firstName: 'A' });
    expect(usersService.update).toHaveBeenCalledWith('u1', { firstName: 'A' });
  });
});
