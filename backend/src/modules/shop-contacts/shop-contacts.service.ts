import { Injectable, NotFoundException } from '@nestjs/common';
import { definedOnly } from '../../common/utils/defined-only.js';
import { assertShopAccess } from '../../common/utils/ownership.js';
import { db } from '../../prisma/db.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.js';
import {
  CreateShopContactDto,
  UpdateShopContactDto,
  ShopContactResponseDto,
} from './dto/index.js';

const rows = () => db.orm.public.ShopContact;

@Injectable()
export class ShopContactService {
  async create(
    dto: CreateShopContactDto,
    user: AuthenticatedUser,
  ): Promise<ShopContactResponseDto> {
    await assertShopAccess(dto.shopId, user);
    return rows().create(dto);
  }

  async findAll(): Promise<ShopContactResponseDto[]> {
    return await rows().all();
  }

  async findById(id: string): Promise<ShopContactResponseDto> {
    const row = await rows().where({ id }).first();
    if (!row) throw new NotFoundException('ShopContact not found');
    return row;
  }

  async update(
    id: string,
    dto: UpdateShopContactDto,
    user: AuthenticatedUser,
  ): Promise<ShopContactResponseDto> {
    const current = await this.findById(id);
    await assertShopAccess(current.shopId, user);
    const row = await rows().where({ id }).update(definedOnly(dto));
    if (!row) throw new NotFoundException('ShopContact not found');
    return row;
  }

  async remove(id: string, user: AuthenticatedUser): Promise<void> {
    const current = await this.findById(id);
    await assertShopAccess(current.shopId, user);
    await rows().where({ id }).delete();
  }
}
