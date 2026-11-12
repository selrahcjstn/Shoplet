import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../prisma/db.js';
import {
  CreateShopContactDto,
  UpdateShopContactDto,
  ShopContactResponseDto,
} from './dto/index.js';

const rows = () => db.orm.public.ShopContact;

@Injectable()
export class ShopContactService {
  create(dto: CreateShopContactDto): Promise<ShopContactResponseDto> {
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
  ): Promise<ShopContactResponseDto> {
    await this.findById(id);
    const row = await rows().where({ id }).update(dto);
    if (!row) throw new NotFoundException('ShopContact not found');
    return row;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await rows().where({ id }).delete();
  }
}
