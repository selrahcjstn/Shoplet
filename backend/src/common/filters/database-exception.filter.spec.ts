import {
  Controller,
  Get,
  type INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DatabaseExceptionFilter } from './database-exception.filter.js';

/** Shaped like the SqlQueryError the Prisma Postgres driver throws. */
const sqlError = (sqlState: string, constraint?: string) =>
  Object.assign(new Error('driver message with SQL internals'), {
    kind: 'sql_query',
    sqlState,
    constraint,
  });

@Controller('t')
class ThrowingController {
  @Get('duplicate')
  duplicate() {
    throw sqlError('23505', 'business_categories_name_key');
  }
  @Get('fk')
  fk() {
    throw sqlError('23503');
  }
  @Get('not-null')
  notNull() {
    throw sqlError('23502');
  }
  @Get('wrapped')
  wrapped() {
    throw Object.assign(new Error('x'), { cause: { code: '23505' } });
  }
  @Get('http')
  http() {
    throw new NotFoundException('User not found');
  }
  @Get('unknown-sql')
  unknownSql() {
    throw sqlError('57014');
  }
  @Get('plain')
  plain() {
    throw new Error('boom: select * from secrets');
  }
}

describe('DatabaseExceptionFilter', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ThrowingController],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalFilters(
      new DatabaseExceptionFilter(app.get(HttpAdapterHost).httpAdapter),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('maps a unique violation to 409', async () => {
    const res = await request(app.getHttpServer())
      .get('/t/duplicate')
      .expect(409);
    expect(res.body).toEqual({
      statusCode: 409,
      error: 'Conflict',
      message: 'A record with the same unique value already exists',
    });
  });

  it('maps a foreign key violation to 400', async () => {
    const res = await request(app.getHttpServer()).get('/t/fk').expect(400);
    expect(res.body.message).toMatch(/referenced record/);
  });

  it('maps a not-null violation to 400', async () => {
    await request(app.getHttpServer()).get('/t/not-null').expect(400);
  });

  it('reads the code from a wrapped cause', async () => {
    await request(app.getHttpServer()).get('/t/wrapped').expect(409);
  });

  it('never leaks driver or SQL details', async () => {
    const res = await request(app.getHttpServer()).get('/t/duplicate');
    expect(JSON.stringify(res.body)).not.toMatch(
      /SQL|constraint|business_categories/,
    );
  });

  it('leaves normal HTTP exceptions alone', async () => {
    const res = await request(app.getHttpServer()).get('/t/http').expect(404);
    expect(res.body.message).toBe('User not found');
  });

  it('keeps unknown database errors as a generic 500', async () => {
    const res = await request(app.getHttpServer())
      .get('/t/unknown-sql')
      .expect(500);
    expect(res.body).toEqual({
      statusCode: 500,
      message: 'Internal server error',
    });
  });

  it('keeps unexpected errors as a generic 500', async () => {
    const res = await request(app.getHttpServer()).get('/t/plain').expect(500);
    expect(JSON.stringify(res.body)).not.toMatch(/secrets/);
  });
});
