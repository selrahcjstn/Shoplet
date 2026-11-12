import { Injectable } from '@nestjs/common';
import { definedOnly } from '../../common/utils/defined-only.js';
import { db } from '../../prisma/db.js';
import { CreateStoreViewDto, StoreViewResponseDto } from './dto/index.js';

const rows = () => db.orm.public.StoreView;

@Injectable()
export class StoreViewService {
  create(dto: CreateStoreViewDto): Promise<StoreViewResponseDto> {
    return rows().create(dto);
  }

  async findAll(): Promise<StoreViewResponseDto[]> {
    return await rows().all();
  }
}
