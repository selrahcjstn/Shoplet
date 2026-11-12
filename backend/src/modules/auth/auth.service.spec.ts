import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

const SECRET = 'unit-test-secret-unit-test-secret-1234';

describe('AuthService', () => {
  let service: AuthService;
  let jwt: JwtService;
  let users: {
    create: ReturnType<typeof vi.fn>;
    findAuthByEmail: ReturnType<typeof vi.fn>;
  };
  let row: Record<string, unknown>;

  beforeEach(async () => {
    row = {
      id: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
      email: 'juan@example.com',
      passwordHash: await bcrypt.hash('correct-password', 4),
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      role: 'SELLER',
      isActive: true,
      emailVerifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users = { create: vi.fn(), findAuthByEmail: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: SECRET })],
      providers: [AuthService, { provide: UsersService, useValue: users }],
    }).compile();

    service = module.get(AuthService);
    jwt = module.get(JwtService);
  });

  it('register delegates to UsersService', async () => {
    const dto = {
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      email: 'juan@example.com',
      password: 'correct-password',
    };
    users.create.mockResolvedValue({ id: 'x' });
    await expect(service.register(dto)).resolves.toEqual({ id: 'x' });
    expect(users.create).toHaveBeenCalledWith(dto);
  });

  it('register propagates the duplicate-email error', async () => {
    users.create.mockRejectedValue(new Error('Email already in use'));
    await expect(
      service.register({
        firstName: 'a',
        lastName: 'b',
        email: 'juan@example.com',
        password: 'correct-password',
      }),
    ).rejects.toThrow('Email already in use');
  });

  it('login returns a token carrying user id and role, plus a safe user', async () => {
    users.findAuthByEmail.mockResolvedValue(row);
    const result = await service.login({
      email: 'juan@example.com',
      password: 'correct-password',
    });

    const payload = await jwt.verifyAsync(result.accessToken);
    expect(payload.sub).toBe(row['id']);
    expect(payload.role).toBe('SELLER');
    expect(result.tokenType).toBe('Bearer');
    expect(result.user.email).toBe('juan@example.com');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects a wrong password with the generic message', async () => {
    users.findAuthByEmail.mockResolvedValue(row);
    await expect(
      service.login({ email: 'juan@example.com', password: 'nope' }),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
  });

  it('rejects an unknown email with the same message', async () => {
    users.findAuthByEmail.mockResolvedValue(null);
    await expect(
      service.login({ email: 'ghost@example.com', password: 'whatever' }),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
  });

  it('rejects an inactive account with the same message', async () => {
    users.findAuthByEmail.mockResolvedValue({ ...row, isActive: false });
    await expect(
      service.login({
        email: 'juan@example.com',
        password: 'correct-password',
      }),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
  });
});
