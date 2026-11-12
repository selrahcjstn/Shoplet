import { Injectable, NotFoundException } from '@nestjs/common';
import { definedOnly } from '../../common/utils/defined-only.js';
import { assertShopAccess } from '../../common/utils/ownership.js';
import { db } from '../../prisma/db.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.js';
import { CreateShopDto, UpdateShopDto, ShopResponseDto } from './dto/index.js';

const rows = () => db.orm.public.Shop;

@Injectable()
export class ShopService {
  async create(
    dto: CreateShopDto,
    user: AuthenticatedUser,
  ): Promise<ShopResponseDto> {
    return rows().create({ ...dto, ownerId: user.id });
  }

  async findAll(): Promise<ShopResponseDto[]> {
    return await rows().all();
  }

  async findById(id: string): Promise<ShopResponseDto> {
    const row = await rows().where({ id }).first();
    if (!row) throw new NotFoundException('Shop not found');
    return row;
  }

  async update(
    id: string,
    dto: UpdateShopDto,
    user: AuthenticatedUser,
  ): Promise<ShopResponseDto> {
    await assertShopAccess(id, user);
    const row = await rows().where({ id }).update(definedOnly(dto));
    if (!row) throw new NotFoundException('Shop not found');
    return row;
  }

  async remove(id: string, user: AuthenticatedUser): Promise<void> {
    await assertShopAccess(id, user);
    await rows().where({ id }).delete();
  }
}
