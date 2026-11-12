import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { AdminActionService } from './admin-actions/admin-actions.service.js';
import { ProductImageService } from './product-images/product-images.service.js';
import { ProductService } from './products/products.service.js';
import { ShopService } from './shops/shops.service.js';

const m = vi.hoisted(() => {
  const model = () => ({
    where: vi.fn(),
    first: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  });
  return {
    Shop: model(),
    Product: model(),
    ProductCategory: model(),
    ProductImage: model(),
    AdminAction: model(),
  };
});

vi.mock('../prisma/db.js', () => ({ db: { orm: { public: m } } }));

const seller = { id: 'seller-1', role: 'SELLER' as const };
const intruder = { id: 'seller-2', role: 'SELLER' as const };
const admin = { id: 'admin-1', role: 'ADMIN' as const };
const ownedShop = { id: 'shop-1', ownerId: 'seller-1' };

beforeEach(() => {
  vi.clearAllMocks();
  for (const model of Object.values(m)) model.where.mockReturnValue(model);
});

describe('ShopService ownership', () => {
  const service = new ShopService();

  it('creates the shop for the authenticated user', async () => {
    m.Shop.create.mockResolvedValue({});
    await service.create({ name: 'S', slug: 's' }, seller);
    expect(m.Shop.create).toHaveBeenCalledWith({
      name: 'S',
      slug: 's',
      ownerId: 'seller-1',
    });
  });

  it("refuses to update another seller's shop", async () => {
    m.Shop.first.mockResolvedValue(ownedShop);
    await expect(
      service.update('shop-1', { name: 'Hijacked' }, intruder),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(m.Shop.update).not.toHaveBeenCalled();
  });

  it("refuses to delete another seller's shop", async () => {
    m.Shop.first.mockResolvedValue(ownedShop);
    await expect(service.remove('shop-1', intruder)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(m.Shop.delete).not.toHaveBeenCalled();
  });

  it('lets the owner and an admin update', async () => {
    m.Shop.first.mockResolvedValue(ownedShop);
    m.Shop.update.mockResolvedValue({ id: 'shop-1' });
    await expect(
      service.update('shop-1', { name: 'Mine' }, seller),
    ).resolves.toBeDefined();
    await expect(
      service.update('shop-1', { name: 'Moderated' }, admin),
    ).resolves.toBeDefined();
  });
});

describe('ProductService ownership', () => {
  const service = new ProductService();
  const dto = {
    shopId: 'shop-1',
    name: 'P',
    slug: 'p',
    price: '1.00',
    availability: 'AVAILABLE',
  };

  it("refuses to add a product to another seller's shop", async () => {
    m.Shop.first.mockResolvedValue(ownedShop);
    await expect(service.create(dto, intruder)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(m.Product.create).not.toHaveBeenCalled();
  });

  it('rejects a category that belongs to a different shop', async () => {
    m.Shop.first.mockResolvedValue(ownedShop);
    m.ProductCategory.first.mockResolvedValue({ id: 'c1', shopId: 'other' });
    await expect(
      service.create({ ...dto, categoryId: 'c1' }, seller),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates a product in the sellers own shop', async () => {
    m.Shop.first.mockResolvedValue(ownedShop);
    m.Product.create.mockResolvedValue({ id: 'p1' });
    await expect(service.create(dto, seller)).resolves.toEqual({ id: 'p1' });
  });
});

describe('ProductImageService ownership', () => {
  const service = new ProductImageService();

  it("refuses to add an image to another seller's product", async () => {
    m.Product.first.mockResolvedValue({ id: 'p1', shopId: 'shop-1' });
    m.Shop.first.mockResolvedValue(ownedShop);
    await expect(
      service.create(
        { productId: 'p1', imageUrl: 'https://x.test/a.jpg' },
        intruder,
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(m.ProductImage.create).not.toHaveBeenCalled();
  });
});

describe('AdminActionService', () => {
  it('records the acting admin from the token, not the request', async () => {
    m.AdminAction.create.mockResolvedValue({});
    await new AdminActionService().create({ action: 'SUSPEND_USER' }, admin);
    expect(m.AdminAction.create).toHaveBeenCalledWith({
      action: 'SUSPEND_USER',
      adminId: 'admin-1',
    });
  });
});
