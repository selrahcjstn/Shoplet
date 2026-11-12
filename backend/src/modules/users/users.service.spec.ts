import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { UsersService } from './users.service.js';

// Chainable stand-in for db.orm.public.User.
const model = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  first: vi.fn(),
  where: vi.fn(),
}));

vi.mock('../../prisma/db.js', () => ({
  db: { orm: { public: { User: model } } },
}));

const row = (over: Record<string, unknown> = {}) => ({
  id: '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60',
  email: 'juan@example.com',
  passwordHash: 'hash',
  firstName: 'Juan',
  lastName: 'Dela Cruz',
  role: 'SELLER',
  isActive: true,
  emailVerifiedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...over,
});

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    vi.clearAllMocks();
    model.where.mockReturnValue(model);

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create hashes the password with bcrypt and omits the hash from the result', async () => {
    model.first.mockResolvedValue(null);
    model.create.mockImplementation(async (data: Record<string, unknown>) =>
      row(data),
    );

    const result = await service.create({
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      email: 'juan@example.com',
      password: 'correct-password',
    });

    const saved = model.create.mock.calls[0]![0] as { passwordHash: string };
    expect(saved.passwordHash).not.toContain('correct-password');
    expect(await bcrypt.compare('correct-password', saved.passwordHash)).toBe(
      true,
    );
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('create rejects a duplicate email', async () => {
    model.first.mockResolvedValue(row());
    await expect(
      service.create({
        firstName: 'a',
        lastName: 'b',
        email: 'juan@example.com',
        password: 'correct-password',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(model.create).not.toHaveBeenCalled();
  });

  it('findById throws when the user does not exist', async () => {
    model.first.mockResolvedValue(null);
    await expect(service.findById('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('update sends only the fields that were provided', async () => {
    model.first.mockResolvedValue(row());
    model.update.mockResolvedValue(row({ firstName: 'Juanito' }));

    // class-transformer can leave unsent optional fields as undefined
    await service.update('id', {
      firstName: 'Juanito',
      lastName: undefined,
      email: undefined,
    });

    expect(model.update).toHaveBeenCalledWith({ firstName: 'Juanito' });
  });

  it('update rejects an email owned by another user', async () => {
    model.first
      .mockResolvedValueOnce(row({ id: 'me' }))
      .mockResolvedValueOnce(row({ id: 'someone-else' }));
    await expect(
      service.update('me', { email: 'taken@example.com' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
