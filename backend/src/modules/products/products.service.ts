import { Injectable, NotFoundException } from '@nestjs/common';
import { definedOnly } from '../../common/utils/defined-only.js';
import {
  assertCategoryInShop,
  assertShopAccess,
} from '../../common/utils/ownership.js';
import { db } from '../../prisma/db.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.js';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from './dto/index.js';

const rows = () => db.orm.public.Product;

@Injectable()
export class ProductService {
  async create(
    dto: CreateProductDto,
    user: AuthenticatedUser,
  ): Promise<ProductResponseDto> {
    await assertShopAccess(dto.shopId, user);
    if (dto.categoryId) await assertCategoryInShop(dto.categoryId, dto.shopId);
    return rows().create(dto);
  }

  async findAll(): Promise<ProductResponseDto[]> {
    return await rows().all();
  }

  async findById(id: string): Promise<ProductResponseDto> {
    const row = await rows().where({ id }).first();
    if (!row) throw new NotFoundException('Product not found');
    return row;
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    user: AuthenticatedUser,
  ): Promise<ProductResponseDto> {
    const current = await this.findById(id);
    await assertShopAccess(current.shopId, user);
    if (dto.categoryId)
      await assertCategoryInShop(dto.categoryId, current.shopId);
    const row = await rows().where({ id }).update(definedOnly(dto));
    if (!row) throw new NotFoundException('Product not found');
    return row;
  }

  async remove(id: string, user: AuthenticatedUser): Promise<void> {
    const current = await this.findById(id);
    await assertShopAccess(current.shopId, user);
    await rows().where({ id }).delete();
  }
}
