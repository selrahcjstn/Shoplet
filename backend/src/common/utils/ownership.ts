import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../../prisma/db.js';
import type { AuthenticatedUser } from '../../modules/auth/types/jwt-payload.js';

const FORBIDDEN = 'You do not have access to this shop';

/** Passes for the shop's owner or an admin. 404 if the shop doesn't exist. */
export async function assertShopAccess(
  shopId: string,
  user: AuthenticatedUser,
): Promise<void> {
  const shop = await db.orm.public.Shop.where({ id: shopId }).first();
  if (!shop) throw new NotFoundException('Shop not found');
  if (user.role !== 'ADMIN' && shop.ownerId !== user.id) {
    throw new ForbiddenException(FORBIDDEN);
  }
}

/** Same check for a product, through the shop it belongs to. */
export async function assertProductAccess(
  productId: string,
  user: AuthenticatedUser,
): Promise<void> {
  const product = await db.orm.public.Product.where({ id: productId }).first();
  if (!product) throw new NotFoundException('Product not found');
  await assertShopAccess(product.shopId, user);
}

/** A product may only use a category that belongs to its own shop. */
export async function assertCategoryInShop(
  categoryId: string,
  shopId: string,
): Promise<void> {
  const category = await db.orm.public.ProductCategory.where({
    id: categoryId,
  }).first();
  if (!category || category.shopId !== shopId) {
    throw new BadRequestException('Category does not exist in this shop');
  }
}
