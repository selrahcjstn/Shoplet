import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../prisma/db.js';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from './dto/index.js';

const rows = () => db.orm.public.Product;

@Injectable()
export class ProductService {
  create(dto: CreateProductDto): Promise<ProductResponseDto> {
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

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    await this.findById(id);
    const row = await rows().where({ id }).update(dto);
    if (!row) throw new NotFoundException('Product not found');
    return row;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await rows().where({ id }).delete();
  }
}
