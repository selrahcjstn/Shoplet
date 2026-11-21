import { Injectable } from '@nestjs/common';
import { definedOnly } from '../../common/utils/defined-only.js';
import { db } from '../../prisma/db.js';
import { TrackingTokenService } from '../tracking/tracking-token.service.js';
import { CreateContactClickDto, ContactClickResponseDto } from './dto/index.js';

const rows = () => db.orm.public.ContactClick;

@Injectable()
export class ContactClickService {
  constructor(private readonly tracking: TrackingTokenService) {}

  /**
   * Counts a click only when it carries a valid token from that shop's page, and, when a product
   * is named, only when the product belongs to the same shop.
   */
  async create(dto: CreateContactClickDto): Promise<ContactClickResponseDto> {
    await this.tracking.assertShop(dto.trackingToken, dto.shopId);
    if (dto.productId)
      await this.tracking.assertProduct(dto.trackingToken, dto.productId);
    return rows().create({
      shopId: dto.shopId,
      productId: dto.productId,
      contactType: dto.contactType,
    });
  }

  async findAll(): Promise<ContactClickResponseDto[]> {
    return await rows().all();
  }
}
