import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  assertCategoryInShop,
  assertProductAccess,
  assertShopAccess,
} from './ownership.js';

const m = vi.hoisted(() => ({
  shop: { where: vi.fn(), first: vi.fn() },
  product: { where: vi.fn(), first: vi.fn() },
  category: { where: vi.fn(), first: vi.fn() },
}));

vi.mock('../../prisma/db.js', () => ({
  db: {
    orm: {
      public: {
        Shop: m.shop,
        Product: m.product,
        ProductCategory: m.category,
      },
    },
  },
}));

const seller = { id: 'seller-1', role: 'SELLER' as const };
const otherSeller = { id: 'seller-2', role: 'SELLER' as const };
const admin = { id: 'admin-1', role: 'ADMIN' as const };

beforeEach(() => {
  vi.clearAllMocks();
  for (const model of Object.values(m)) model.where.mockReturnValue(model);
});

describe('assertShopAccess', () => {
  it('allows the owner', async () => {
    m.shop.first.mockResolvedValue({ id: 's1', ownerId: 'seller-1' });
    await expect(assertShopAccess('s1', seller)).resolves.toBeUndefined();
  });

  it('allows an admin on any shop', async () => {
    m.shop.first.mockResolvedValue({ id: 's1', ownerId: 'seller-1' });
    await expect(assertShopAccess('s1', admin)).resolves.toBeUndefined();
  });

  it("refuses another seller's shop", async () => {
    m.shop.first.mockResolvedValue({ id: 's1', ownerId: 'seller-1' });
    await expect(assertShopAccess('s1', otherSeller)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('404s when the shop does not exist', async () => {
    m.shop.first.mockResolvedValue(null);
    await expect(assertShopAccess('nope', seller)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

describe('assertProductAccess', () => {
  it("checks ownership through the product's shop", async () => {
    m.product.first.mockResolvedValue({ id: 'p1', shopId: 's1' });
    m.shop.first.mockResolvedValue({ id: 's1', ownerId: 'seller-1' });
    await expect(assertProductAccess('p1', seller)).resolves.toBeUndefined();
    await expect(assertProductAccess('p1', otherSeller)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('404s for an unknown product', async () => {
    m.product.first.mockResolvedValue(null);
    await expect(assertProductAccess('nope', seller)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

describe('assertCategoryInShop', () => {
  it('accepts a category from the same shop', async () => {
    m.category.first.mockResolvedValue({ id: 'c1', shopId: 's1' });
    await expect(assertCategoryInShop('c1', 's1')).resolves.toBeUndefined();
  });

  it('rejects a category from another shop or a missing one', async () => {
    m.category.first.mockResolvedValue({ id: 'c1', shopId: 's2' });
    await expect(assertCategoryInShop('c1', 's1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    m.category.first.mockResolvedValue(null);
    await expect(assertCategoryInShop('c1', 's1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
