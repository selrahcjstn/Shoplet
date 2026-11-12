import { Injectable, NotFoundException } from '@nestjs/common';
import { definedOnly } from '../../common/utils/defined-only.js';
import { db } from '../../prisma/db.js';
import { CreateShopDto, UpdateShopDto, ShopResponseDto } from './dto/index.js';

const rows = () => db.orm.public.Shop;

@Injectable()
export class ShopService {
  create(dto: CreateShopDto): Promise<ShopResponseDto> {
    return rows().create(dto);
  }

  async findAll(): Promise<ShopResponseDto[]> {
    return await rows().all();
  }

  async findById(id: string): Promise<ShopResponseDto> {
    const row = await rows().where({ id }).first();
    if (!row) throw new NotFoundException('Shop not found');
    return row;
  }

  async update(id: string, dto: UpdateShopDto): Promise<ShopResponseDto> {
    await this.findById(id);
    const row = await rows().where({ id }).update(definedOnly(dto));
    if (!row) throw new NotFoundException('Shop not found');
    return row;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await rows().where({ id }).delete();
  }
}
