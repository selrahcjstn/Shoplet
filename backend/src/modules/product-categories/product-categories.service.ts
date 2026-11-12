import { Injectable, NotFoundException } from '@nestjs/common';
import { definedOnly } from '../../common/utils/defined-only.js';
import { assertShopAccess } from '../../common/utils/ownership.js';
import { db } from '../../prisma/db.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.js';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
  ProductCategoryResponseDto,
} from './dto/index.js';

const rows = () => db.orm.public.ProductCategory;

@Injectable()
export class ProductCategoryService {
  async create(
    dto: CreateProductCategoryDto,
    user: AuthenticatedUser,
  ): Promise<ProductCategoryResponseDto> {
    await assertShopAccess(dto.shopId, user);
    return rows().create(dto);
  }

  async findAll(): Promise<ProductCategoryResponseDto[]> {
    return await rows().all();
  }

  async findById(id: string): Promise<ProductCategoryResponseDto> {
    const row = await rows().where({ id }).first();
    if (!row) throw new NotFoundException('ProductCategory not found');
    return row;
  }

  async update(
    id: string,
    dto: UpdateProductCategoryDto,
    user: AuthenticatedUser,
  ): Promise<ProductCategoryResponseDto> {
    const current = await this.findById(id);
    await assertShopAccess(current.shopId, user);
    const row = await rows().where({ id }).update(definedOnly(dto));
    if (!row) throw new NotFoundException('ProductCategory not found');
    return row;
  }

  async remove(id: string, user: AuthenticatedUser): Promise<void> {
    const current = await this.findById(id);
    await assertShopAccess(current.shopId, user);
    await rows().where({ id }).delete();
  }
}
