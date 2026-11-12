import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = { register: vi.fn(), login: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login delegates to AuthService', async () => {
    authService.login.mockResolvedValue({ accessToken: 't' });
    const dto = { email: 'a@b.co', password: 'pw' };
    await expect(controller.login(dto)).resolves.toEqual({ accessToken: 't' });
    expect(authService.login).toHaveBeenCalledWith(dto);
  });
});
