import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../prisma/db.js';
import {
  CreateBusinessCategoryDto,
  UpdateBusinessCategoryDto,
  BusinessCategoryResponseDto,
} from './dto/index.js';

const rows = () => db.orm.public.BusinessCategory;

@Injectable()
export class BusinessCategoryService {
  create(dto: CreateBusinessCategoryDto): Promise<BusinessCategoryResponseDto> {
    return rows().create(dto);
  }

  async findAll(): Promise<BusinessCategoryResponseDto[]> {
    return await rows().all();
  }

  async findById(id: string): Promise<BusinessCategoryResponseDto> {
    const row = await rows().where({ id }).first();
    if (!row) throw new NotFoundException('BusinessCategory not found');
    return row;
  }

  async update(
    id: string,
    dto: UpdateBusinessCategoryDto,
  ): Promise<BusinessCategoryResponseDto> {
    await this.findById(id);
    const row = await rows().where({ id }).update(dto);
    if (!row) throw new NotFoundException('BusinessCategory not found');
    return row;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await rows().where({ id }).delete();
  }
}
