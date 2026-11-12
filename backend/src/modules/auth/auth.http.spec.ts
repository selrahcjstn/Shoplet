import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import request from 'supertest';
import { definedOnly } from '../../common/utils/defined-only.js';
import { UsersController } from '../users/users.controller.js';
import { UsersService } from '../users/users.service.js';
import { UserResponseDto } from '../users/dto/index.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

const SECRET = 'http-test-secret-http-test-secret-12345';

interface Row {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'SELLER' | 'ADMIN';
  isActive: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/** In-memory stand-in for UsersService (no database needed). */
class FakeUsersService {
  rows: Row[] = [];

  async create(dto: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const { ConflictException } = await import('@nestjs/common');
    if (this.rows.some((r) => r.email === dto.email)) {
      throw new ConflictException('Email already in use');
    }
    const row: Row = {
      id: crypto.randomUUID(),
      email: dto.email,
      passwordHash: await bcrypt.hash(dto.password, 4),
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: 'SELLER',
      isActive: true,
      emailVerifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.rows.push(row);
    return UserResponseDto.from(row);
  }

  async findAuthByEmail(email: string) {
    return this.rows.find((r) => r.email === email) ?? null;
  }

  async findAuthById(id: string) {
    return this.rows.find((r) => r.id === id) ?? null;
  }

  async findById(id: string) {
    const row = this.rows.find((r) => r.id === id);
    if (!row) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException('User not found');
    }
    return UserResponseDto.from(row);
  }

  async update(
    id: string,
    dto: Partial<Pick<Row, 'firstName' | 'lastName' | 'email'>>,
  ) {
    const row = this.rows.find((r) => r.id === id)!;
    Object.assign(row, definedOnly(dto));
    return UserResponseDto.from(row);
  }
}

describe('Auth + protected routes (HTTP)', () => {
  let app: INestApplication;
  let users: FakeUsersService;
  let jwt: JwtService;

  const creds = {
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    email: 'juan@example.com',
    password: 'Correct-Pass1!',
  };

  beforeAll(async () => {
    process.env['JWT_SECRET'] = SECRET;
    users = new FakeUsersService();

    const moduleRef = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: SECRET,
          signOptions: { expiresIn: '15m' },
        }),
      ],
      controllers: [AuthController, UsersController],
      providers: [
        AuthService,
        JwtStrategy,
        { provide: UsersService, useValue: users },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    jwt = moduleRef.get(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  async function loginToken() {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: creds.email, password: creds.password })
      .expect(200);
    return res.body.accessToken as string;
  }

  describe('registration', () => {
    it('registers a user and never returns the password hash', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(creds)
        .expect(201);
      expect(res.body.email).toBe(creds.email);
      expect(res.body).not.toHaveProperty('passwordHash');
      expect(res.body).not.toHaveProperty('password');
      expect(users.rows[0]!.passwordHash).toMatch(/^\$2[aby]\$/);
      expect(users.rows[0]!.passwordHash).not.toContain(creds.password);
    });

    it('rejects a duplicate email with 409', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(creds)
        .expect(409);
    });

    it('rejects invalid input with 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...creds, email: 'not-an-email', password: 'short' })
        .expect(400);
      expect(res.body.message.join(' ')).toMatch(/email/i);
      expect(res.body.message.join(' ')).toMatch(/password/i);
    });

    it.each([
      ['Sh0rt!', 'at least 8 characters'],
      ['alllowercase1!', 'uppercase letter'],
      ['ALLUPPERCASE1!', 'lowercase letter'],
      ['NoNumbers!!', 'number'],
      ['NoSpecial123', 'special character'],
    ])('rejects password %s with a clear message', async (password, text) => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...creds, email: 'rules@example.com', password })
        .expect(400);
      expect(res.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining(text)]),
      );
    });

    it('returns friendly messages for missing fields', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({})
        .expect(400);
      expect(res.body.message).toEqual(
        expect.arrayContaining([
          'First name is required',
          'Last name is required',
          'Please enter a valid email address',
        ]),
      );
    });

    it('does not let clients set role', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...creds, email: 'evil@example.com', role: 'ADMIN' })
        .expect(400);
    });
  });

  describe('login', () => {
    it('returns an access token and a safe user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: creds.email, password: creds.password })
        .expect(200);
      expect(res.body.tokenType).toBe('Bearer');
      expect(res.body.user.email).toBe(creds.email);
      expect(res.body.user).not.toHaveProperty('passwordHash');
      const payload = jwt.decode(res.body.accessToken);
      expect(payload.sub).toBe(users.rows[0]!.id);
      expect(payload.role).toBe('SELLER');
    });

    it('rejects a wrong password and an unknown email identically', async () => {
      const wrong = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: creds.email, password: 'wrong-password' })
        .expect(401);
      const unknown = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'ghost@example.com', password: 'wrong-password' })
        .expect(401);
      expect(wrong.body).toEqual(unknown.body);
    });
  });

  describe('JWT guard on /users/me', () => {
    const server = () => app.getHttpServer();

    it('rejects a missing token', async () => {
      await request(server()).get('/users/me').expect(401);
    });

    it('rejects a malformed token', async () => {
      await request(server())
        .get('/users/me')
        .set('Authorization', 'Bearer not.a.jwt')
        .expect(401);
    });

    it('rejects a token signed with another secret', async () => {
      const forged = new JwtService({ secret: 'x'.repeat(40) }).sign({
        sub: users.rows[0]!.id,
        role: 'ADMIN',
      });
      await request(server())
        .get('/users/me')
        .set('Authorization', `Bearer ${forged}`)
        .expect(401);
    });

    it('rejects an expired token', async () => {
      const expired = jwt.sign(
        { sub: users.rows[0]!.id, role: 'SELLER' },
        { expiresIn: '-10s' },
      );
      await request(server())
        .get('/users/me')
        .set('Authorization', `Bearer ${expired}`)
        .expect(401);
    });

    it('rejects a token for a user that no longer exists', async () => {
      const ghost = jwt.sign({ sub: crypto.randomUUID(), role: 'SELLER' });
      await request(server())
        .get('/users/me')
        .set('Authorization', `Bearer ${ghost}`)
        .expect(401);
    });

    it('accepts a valid token', async () => {
      const token = await loginToken();
      const res = await request(server())
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(res.body.email).toBe(creds.email);
      expect(res.body).not.toHaveProperty('passwordHash');
    });
  });

  describe('profile', () => {
    it('PATCH /users/me requires a token', async () => {
      await request(app.getHttpServer())
        .patch('/users/me')
        .send({ firstName: 'X' })
        .expect(401);
    });

    it('updates only the authenticated user', async () => {
      const other = await users.create({
        firstName: 'Other',
        lastName: 'Person',
        email: 'other@example.com',
        password: 'another-password',
      });
      const token = await loginToken();

      const res = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Juanito' })
        .expect(200);
      expect(res.body.firstName).toBe('Juanito');
      expect(res.body.id).toBe(users.rows[0]!.id);
      expect(users.rows.find((r) => r.id === other.id)!.firstName).toBe(
        'Other',
      );
    });

    it('ignores client-supplied ids (rejected as non-whitelisted)', async () => {
      const token = await loginToken();
      await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ id: crypto.randomUUID(), firstName: 'Hacker' })
        .expect(400);
    });

    it('rejects a token after the account is deactivated', async () => {
      const token = await loginToken();
      users.rows[0]!.isActive = false;
      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
      users.rows[0]!.isActive = true;
    });
  });
});
