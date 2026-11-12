import { Injectable, NotFoundException } from '@nestjs/common';
import { definedOnly } from '../../common/utils/defined-only.js';
import { assertProductAccess } from '../../common/utils/ownership.js';
import { db } from '../../prisma/db.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.js';
import {
  CreateProductImageDto,
  UpdateProductImageDto,
  ProductImageResponseDto,
} from './dto/index.js';

const rows = () => db.orm.public.ProductImage;

@Injectable()
export class ProductImageService {
  async create(
    dto: CreateProductImageDto,
    user: AuthenticatedUser,
  ): Promise<ProductImageResponseDto> {
    await assertProductAccess(dto.productId, user);
    return rows().create(dto);
  }

  async findAll(): Promise<ProductImageResponseDto[]> {
    return await rows().all();
  }

  async findById(id: string): Promise<ProductImageResponseDto> {
    const row = await rows().where({ id }).first();
    if (!row) throw new NotFoundException('ProductImage not found');
    return row;
  }

  async update(
    id: string,
    dto: UpdateProductImageDto,
    user: AuthenticatedUser,
  ): Promise<ProductImageResponseDto> {
    const current = await this.findById(id);
    await assertProductAccess(current.productId, user);
    const row = await rows().where({ id }).update(definedOnly(dto));
    if (!row) throw new NotFoundException('ProductImage not found');
    return row;
  }

  async remove(id: string, user: AuthenticatedUser): Promise<void> {
    const current = await this.findById(id);
    await assertProductAccess(current.productId, user);
    await rows().where({ id }).delete();
  }
}
