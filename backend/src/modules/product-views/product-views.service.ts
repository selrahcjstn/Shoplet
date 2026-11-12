import { Injectable } from '@nestjs/common';
import { db } from '../../prisma/db.js';
import { CreateProductViewDto, ProductViewResponseDto } from './dto/index.js';

const rows = () => db.orm.public.ProductView;

@Injectable()
export class ProductViewService {
  create(dto: CreateProductViewDto): Promise<ProductViewResponseDto> {
    return rows().create(dto);
  }

  async findAll(): Promise<ProductViewResponseDto[]> {
    return await rows().all();
  }
}
