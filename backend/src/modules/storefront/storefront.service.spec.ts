import { NotFoundException } from '@nestjs/common';
import { StorefrontService } from './storefront.service.js';

const m = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock('../../prisma/pool.js', () => ({
  getPool: () => ({ query: m.query }),
}));

const owner = { id: 'owner-1', role: 'SELLER' as const };
const stranger = { id: 'someone-else', role: 'SELLER' as const };
const admin = { id: 'admin-1', role: 'ADMIN' as const };

function shopRow(isPublished: boolean) {
  return {
    id: 'shop-1',
    owner_id: 'owner-1',
    name: 'Maple & Co.',
    slug: 'maple',
    description: 'Candles',
    logo_url: null,
    cover_image_url: null,
    accent_color: '#176b5b',
    announcement: null,
    is_published: isPublished,
    business_category: 'Home goods',
  };
}

/** Shop first, then categories, products and contacts in that order. */
function mockShop(isPublished: boolean) {
  m.query
    .mockResolvedValueOnce({ rows: [shopRow(isPublished)] })
    .mockResolvedValueOnce({
      rows: [{ id: 'c1', name: 'Candles', slug: 'candles' }],
    })
    .mockResolvedValueOnce({
      rows: [
        {
          id: 'p1',
          category_id: 'c1',
          name: 'Soy candle',
          slug: 'soy-candle',
          description: null,
          price: '380.00',
          availability: 'AVAILABLE',
          is_featured: true,
          images: [
            { id: 'i1', imageUrl: 'https://x.test/a.jpg', altText: null },
          ],
        },
      ],
    })
    .mockResolvedValueOnce({
      rows: [
        {
          id: 'k1',
          contact_type: 'whatsapp',
          contact_value: '+63 917 555 0142',
        },
      ],
    });
}

beforeEach(() => vi.clearAllMocks());

describe('StorefrontService.bySlug', () => {
  const service = new StorefrontService();

  it('shows a published shop to anyone', async () => {
    mockShop(true);
    const result = await service.bySlug('maple', null);

    expect(result.isPreview).toBe(false);
    expect(result.isOwner).toBe(false);
    expect(result.shop).toMatchObject({
      name: 'Maple & Co.',
      businessCategory: 'Home goods',
    });
    expect(result.products[0]).toEqual({
      id: 'p1',
      categoryId: 'c1',
      name: 'Soy candle',
      slug: 'soy-candle',
      description: null,
      price: '380.00',
      availability: 'AVAILABLE',
      isFeatured: true,
      images: [{ id: 'i1', imageUrl: 'https://x.test/a.jpg', altText: null }],
    });
    expect(result.contacts).toEqual([
      { id: 'k1', contactType: 'whatsapp', contactValue: '+63 917 555 0142' },
    ]);
  });

  it('flags the owner on their own published shop', async () => {
    mockShop(true);
    const result = await service.bySlug('maple', owner);
    expect(result.isOwner).toBe(true);
    expect(result.isPreview).toBe(false);
  });

  it('returns 404 for a shop that does not exist', async () => {
    m.query.mockResolvedValueOnce({ rows: [] });
    await expect(service.bySlug('nope', null)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('hides a draft from customers and other sellers with the same 404', async () => {
    m.query.mockResolvedValueOnce({ rows: [shopRow(false)] });
    await expect(service.bySlug('maple', null)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    m.query.mockResolvedValueOnce({ rows: [shopRow(false)] });
    await expect(service.bySlug('maple', stranger)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lets the owner preview their draft', async () => {
    mockShop(false);
    const result = await service.bySlug('maple', owner);
    expect(result.isPreview).toBe(true);
    expect(result.isOwner).toBe(true);
  });

  it('lets an admin preview any draft', async () => {
    mockShop(false);
    await expect(service.bySlug('maple', admin)).resolves.toMatchObject({
      isPreview: true,
    });
  });

  it('only asks for visible products', async () => {
    mockShop(true);
    await service.bySlug('maple', null);
    const productSql = m.query.mock.calls[2]![0] as string;
    expect(productSql).toContain('p.is_visible');
  });
});
