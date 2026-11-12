import { Injectable, NotFoundException } from '@nestjs/common';
import { definedOnly } from '../../common/utils/defined-only.js';
import { db } from '../../prisma/db.js';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
  ProductCategoryResponseDto,
} from './dto/index.js';

const rows = () => db.orm.public.ProductCategory;

@Injectable()
export class ProductCategoryService {
  create(dto: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
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
  ): Promise<ProductCategoryResponseDto> {
    await this.findById(id);
    const row = await rows().where({ id }).update(definedOnly(dto));
    if (!row) throw new NotFoundException('ProductCategory not found');
    return row;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await rows().where({ id }).delete();
  }
}
