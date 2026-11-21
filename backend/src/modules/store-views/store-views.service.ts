import { Injectable } from '@nestjs/common';
import { definedOnly } from '../../common/utils/defined-only.js';
import { db } from '../../prisma/db.js';
import { TrackingTokenService } from '../tracking/tracking-token.service.js';
import { CreateStoreViewDto, StoreViewResponseDto } from './dto/index.js';

const rows = () => db.orm.public.StoreView;

@Injectable()
export class StoreViewService {
  constructor(private readonly tracking: TrackingTokenService) {}

  /** Counts a visit only when it carries a valid token from that shop's page. */
  async create(dto: CreateStoreViewDto): Promise<StoreViewResponseDto> {
    await this.tracking.assertShop(dto.trackingToken, dto.shopId);
    return rows().create({ shopId: dto.shopId });
  }

  async findAll(): Promise<StoreViewResponseDto[]> {
    return await rows().all();
  }
}
