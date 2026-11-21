import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TrackingTokenService } from './tracking-token.service.js';

const m = vi.hoisted(() => ({ Product: { where: vi.fn(), first: vi.fn() } }));
vi.mock('../../prisma/db.js', () => ({ db: { orm: { public: m } } }));
vi.mock('../../config/jwt.config.js', () => ({
  getJwtSecret: () => 'unit-test-secret-unit-test-secret-1234',
}));

const jwt = new JwtService();
const service = new TrackingTokenService(jwt);

beforeEach(() => {
  vi.clearAllMocks();
  m.Product.where.mockReturnValue(m.Product);
});

describe('TrackingTokenService', () => {
  it('accepts its own token for the same shop', async () => {
    const token = await service.sign('shop-1');
    await expect(service.assertShop(token, 'shop-1')).resolves.toBeUndefined();
  });

  it('rejects a token issued for another shop', async () => {
    const token = await service.sign('shop-1');
    await expect(service.assertShop(token, 'shop-2')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('rejects garbage and a token signed with a different key', async () => {
    await expect(
      service.assertShop('not-a-token', 'shop-1'),
    ).rejects.toBeInstanceOf(ForbiddenException);
    // A login-style token signed with the raw secret must not pass as a tracking token.
    const loginToken = await jwt.signAsync(
      { sid: 'shop-1', typ: 'track' },
      { secret: 'unit-test-secret-unit-test-secret-1234' },
    );
    await expect(
      service.assertShop(loginToken, 'shop-1'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects an expired token', async () => {
    vi.useFakeTimers();
    const token = await service.sign('shop-1');
    vi.advanceTimersByTime(3 * 60 * 60 * 1000);
    await expect(service.assertShop(token, 'shop-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    vi.useRealTimers();
  });

  it('checks a product through its shop', async () => {
    const token = await service.sign('shop-1');
    m.Product.first.mockResolvedValueOnce({ id: 'p1', shopId: 'shop-1' });
    await expect(service.assertProduct(token, 'p1')).resolves.toBe('shop-1');

    m.Product.first.mockResolvedValueOnce({ id: 'p2', shopId: 'shop-2' });
    await expect(service.assertProduct(token, 'p2')).rejects.toBeInstanceOf(
      ForbiddenException,
    );

    m.Product.first.mockResolvedValueOnce(null);
    await expect(service.assertProduct(token, 'nope')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
