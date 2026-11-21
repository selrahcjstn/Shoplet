import { Controller, Get, type INestApplication, Post } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import { RATE_LIMIT_MESSAGE, RATE_LIMITS, RateLimit } from './rate-limit.js';

@Controller()
class DemoController {
  @Get('open')
  open() {
    return 'ok';
  }

  @Post('login')
  @RateLimit('auth')
  login() {
    return 'ok';
  }
}

describe('Rate limiting (HTTP)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          throttlers: [{ name: 'default', ...RATE_LIMITS.default }],
          errorMessage: RATE_LIMIT_MESSAGE,
        }),
      ],
      controllers: [DemoController],
      providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('blocks the 11th login attempt in a minute with a friendly 429', async () => {
    for (let i = 0; i < RATE_LIMITS.auth.limit; i++) {
      await request(app.getHttpServer()).post('/login').expect(201);
    }
    const blocked = await request(app.getHttpServer())
      .post('/login')
      .expect(429);
    expect(blocked.body.message).toBe(RATE_LIMIT_MESSAGE);
    expect(blocked.headers['retry-after']).toBeDefined();
  });

  it('gives ordinary routes the much higher default limit', async () => {
    for (let i = 0; i < RATE_LIMITS.auth.limit + 5; i++) {
      await request(app.getHttpServer()).get('/open').expect(200);
    }
  });
});
