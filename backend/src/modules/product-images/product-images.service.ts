import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../prisma/db.js';
import {
  CreateProductImageDto,
  UpdateProductImageDto,
  ProductImageResponseDto,
} from './dto/index.js';

const rows = () => db.orm.public.ProductImage;

@Injectable()
export class ProductImageService {
  create(dto: CreateProductImageDto): Promise<ProductImageResponseDto> {
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
  ): Promise<ProductImageResponseDto> {
    await this.findById(id);
    const row = await rows().where({ id }).update(dto);
    if (!row) throw new NotFoundException('ProductImage not found');
    return row;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await rows().where({ id }).delete();
  }
}
