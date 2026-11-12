import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { AnalyticsService, addDays, sumDays } from './analytics.service.js';

const m = vi.hoisted(() => ({
  Shop: { where: vi.fn(), first: vi.fn() },
  query: vi.fn(),
}));

vi.mock('../../prisma/db.js', () => ({ db: { orm: { public: m } } }));
vi.mock('../../prisma/pool.js', () => ({
  getPool: () => ({ query: m.query }),
}));

const seller = { id: 'seller-1', role: 'SELLER' as const };
const intruder = { id: 'seller-2', role: 'SELLER' as const };
const admin = { id: 'admin-1', role: 'ADMIN' as const };

beforeEach(() => {
  vi.clearAllMocks();
  m.Shop.where.mockReturnValue(m.Shop);
  m.Shop.first.mockResolvedValue({ id: 'shop-1', ownerId: 'seller-1' });
});

describe('addDays', () => {
  it('moves across month and year ends', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2024-03-01', -1)).toBe('2024-02-29');
  });
});

describe('sumDays', () => {
  it('adds each counter separately', () => {
    expect(
      sumDays([
        { date: 'a', storeViews: 1, productViews: 2, contactClicks: 3 },
        { date: 'b', storeViews: 4, productViews: 5, contactClicks: 6 },
      ]),
    ).toEqual({ storeViews: 5, productViews: 7, contactClicks: 9 });
  });

  it('returns zeros for no days', () => {
    expect(sumDays([])).toEqual({
      storeViews: 0,
      productViews: 0,
      contactClicks: 0,
    });
  });
});

describe('AnalyticsService.forShop', () => {
  const service = new AnalyticsService();

  function mockQueries() {
    m.query
      .mockResolvedValueOnce({ rows: [{ today: '2026-11-12' }] })
      .mockResolvedValueOnce({
        rows: [
          // previous period (2 days), then current period (2 days)
          {
            date: '2026-11-08',
            store_views: 1,
            product_views: 1,
            contact_clicks: 0,
          },
          {
            date: '2026-11-09',
            store_views: 2,
            product_views: 0,
            contact_clicks: 1,
          },
          {
            date: '2026-11-11',
            store_views: 3,
            product_views: 4,
            contact_clicks: 0,
          },
          {
            date: '2026-11-12',
            store_views: 5,
            product_views: 6,
            contact_clicks: 2,
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          { id: 'p1', name: 'Mug', is_visible: true, views: 7, clicks: 1 },
          { id: 'p2', name: 'Napkins', is_visible: true, views: 0, clicks: 0 },
          {
            id: 'p3',
            name: 'Old tote',
            is_visible: false,
            views: 0,
            clicks: 0,
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ contact_type: 'email', clicks: 2 }] });
  }

  it('splits the days into this period and the one before it', async () => {
    mockQueries();
    const result = await service.forShop('shop-1', seller, 2, 'Asia/Manila');

    expect(result.range).toEqual({
      days: 2,
      from: '2026-11-11',
      to: '2026-11-12',
      timezone: 'Asia/Manila',
    });
    expect(result.daily.map((d) => d.date)).toEqual([
      '2026-11-11',
      '2026-11-12',
    ]);
    expect(result.totals).toEqual({
      storeViews: 8,
      productViews: 10,
      contactClicks: 2,
    });
    expect(result.previous).toEqual({
      storeViews: 3,
      productViews: 1,
      contactClicks: 1,
    });
    expect(result.topProducts).toEqual([
      { productId: 'p1', name: 'Mug', views: 7, contactClicks: 1 },
    ]);
    // Napkins are the least viewed visible product; the hidden tote is left out.
    expect(result.leastViewed).toEqual([
      { productId: 'p2', name: 'Napkins', views: 0 },
    ]);
    expect(result.contactsByType).toEqual([
      { contactType: 'email', clicks: 2 },
    ]);
  });

  it('asks the database for the previous period too', async () => {
    mockQueries();
    await service.forShop('shop-1', seller, 2);
    // second query: previousFrom, to, shopId, timezone
    expect(m.query.mock.calls[1]![1]).toEqual([
      '2026-11-09',
      '2026-11-12',
      'shop-1',
      'UTC',
    ]);
  });

  it('refuses another seller', async () => {
    await expect(service.forShop('shop-1', intruder)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(m.query).not.toHaveBeenCalled();
  });

  it('lets an admin read any shop', async () => {
    mockQueries();
    await expect(service.forShop('shop-1', admin, 2)).resolves.toBeDefined();
  });

  it('rejects an unknown timezone before touching the database', async () => {
    await expect(
      service.forShop('shop-1', seller, 30, 'Mars/Base'),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(m.query).not.toHaveBeenCalled();
  });
});
