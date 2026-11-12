import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdminActionController } from './admin-actions/admin-actions.controller.js';
import { AdminActionService } from './admin-actions/admin-actions.service.js';
import { JwtAuthGuard } from './auth/guards/jwt.auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { JwtStrategy } from './auth/strategies/jwt.strategy.js';
import { BusinessCategoryController } from './business-categories/business-categories.controller.js';
import { BusinessCategoryService } from './business-categories/business-categories.service.js';
import { ProductController } from './products/products.controller.js';
import { ProductService } from './products/products.service.js';
import { ShopController } from './shops/shops.controller.js';
import { ShopService } from './shops/shops.service.js';
import { StoreViewController } from './store-views/store-views.controller.js';
import { StoreViewService } from './store-views/store-views.service.js';
import { UsersService } from './users/users.service.js';

const SECRET = 'access-test-secret-access-test-secret-1';
const SELLER = { id: 'seller-1', role: 'SELLER', isActive: true };
const ADMIN = { id: 'admin-1', role: 'ADMIN', isActive: true };
const SHOP_ID = '3f2b8c0e-6d1a-4c52-9a7e-1b2c3d4e5f60';

const svc = () => ({
  create: vi.fn().mockResolvedValue({}),
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn().mockResolvedValue({}),
  update: vi.fn().mockResolvedValue({}),
  remove: vi.fn().mockResolvedValue(undefined),
});

describe('Access control across controllers (HTTP)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  const shops = svc();
  const products = svc();
  const categories = svc();
  const views = svc();
  const actions = svc();

  const tokenFor = (u: { id: string; role: string }) =>
    `Bearer ${jwt.sign({ sub: u.id, role: u.role })}`;
  const seller = () => tokenFor(SELLER);
  const admin = () => tokenFor(ADMIN);
  const http = () => app.getHttpServer();

  beforeAll(async () => {
    process.env['JWT_SECRET'] = SECRET;
    const moduleRef = await Test.createTestingModule({
      imports: [PassportModule, JwtModule.register({ secret: SECRET })],
      controllers: [
        ShopController,
        ProductController,
        BusinessCategoryController,
        StoreViewController,
        AdminActionController,
      ],
      providers: [
        JwtStrategy,
        {
          provide: UsersService,
          useValue: {
            findAuthById: async (id: string) =>
              [SELLER, ADMIN].find((u) => u.id === id) ?? null,
          },
        },
        { provide: ShopService, useValue: shops },
        { provide: ProductService, useValue: products },
        { provide: BusinessCategoryService, useValue: categories },
        { provide: StoreViewService, useValue: views },
        { provide: AdminActionService, useValue: actions },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
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

  describe('public reads', () => {
    it.each([
      '/shops',
      `/shops/${SHOP_ID}`,
      '/products',
      '/business-categories',
    ])('GET %s needs no token', async (url) => {
      await request(http()).get(url).expect(200);
    });
  });

  describe('writes need a token', () => {
    it.each([
      ['post', '/shops', { name: 'My Shop', slug: 'my-shop' }],
      ['patch', `/shops/${SHOP_ID}`, { name: 'New' }],
      ['delete', `/shops/${SHOP_ID}`, undefined],
      ['patch', `/products/${SHOP_ID}`, { name: 'New' }],
      ['delete', `/products/${SHOP_ID}`, undefined],
    ] as const)(
      '%s %s returns 401 without a token',
      async (method, url, body) => {
        const req = request(http())[method](url);
        await (body ? req.send(body) : req).expect(401);
      },
    );

    it('lets a signed-in seller reach the shop service with their identity', async () => {
      await request(http())
        .post('/shops')
        .set('Authorization', seller())
        .send({ name: 'My Shop', slug: 'my-shop' })
        .expect(201);
      expect(shops.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'My Shop' }),
        { id: 'seller-1', role: 'SELLER' },
      );
    });

    it('does not accept ownerId from the client', async () => {
      await request(http())
        .post('/shops')
        .set('Authorization', seller())
        .send({ name: 'My Shop', slug: 'my-shop', ownerId: SHOP_ID })
        .expect(400);
    });
  });

  describe('admin-only routes', () => {
    it('business category writes: 401 anonymous, 403 seller, ok for admin', async () => {
      const body = { name: 'Food', slug: 'food' };
      await request(http()).post('/business-categories').send(body).expect(401);
      await request(http())
        .post('/business-categories')
        .set('Authorization', seller())
        .send(body)
        .expect(403);
      await request(http())
        .post('/business-categories')
        .set('Authorization', admin())
        .send(body)
        .expect(201);
    });

    it('admin actions: sellers are refused, admin id comes from the token', async () => {
      await request(http()).get('/admin-actions').expect(401);
      await request(http())
        .get('/admin-actions')
        .set('Authorization', seller())
        .expect(403);
      await request(http())
        .post('/admin-actions')
        .set('Authorization', admin())
        .send({ action: 'SUSPEND_USER' })
        .expect(201);
      expect(actions.create).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'SUSPEND_USER' }),
        { id: 'admin-1', role: 'ADMIN' },
      );
      await request(http())
        .post('/admin-actions')
        .set('Authorization', admin())
        .send({ action: 'X', adminId: SHOP_ID })
        .expect(400);
    });
  });

  describe('analytics', () => {
    it('anyone can record a view, only admins can read them', async () => {
      await request(http())
        .post('/store-views')
        .send({ shopId: SHOP_ID })
        .expect(201);
      await request(http()).get('/store-views').expect(401);
      await request(http())
        .get('/store-views')
        .set('Authorization', seller())
        .expect(403);
      await request(http())
        .get('/store-views')
        .set('Authorization', admin())
        .expect(200);
    });
  });
});
