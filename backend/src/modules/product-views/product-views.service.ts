import { Injectable } from '@nestjs/common';
import { definedOnly } from '../../common/utils/defined-only.js';
import { db } from '../../prisma/db.js';
import { TrackingTokenService } from '../tracking/tracking-token.service.js';
import { CreateProductViewDto, ProductViewResponseDto } from './dto/index.js';

const rows = () => db.orm.public.ProductView;

@Injectable()
export class ProductViewService {
  constructor(private readonly tracking: TrackingTokenService) {}

  /** Counts a view only when it carries a valid token from the page of the product's shop. */
  async create(dto: CreateProductViewDto): Promise<ProductViewResponseDto> {
    await this.tracking.assertProduct(dto.trackingToken, dto.productId);
    return rows().create({ productId: dto.productId });
  }

  async findAll(): Promise<ProductViewResponseDto[]> {
    return await rows().all();
  }
}
