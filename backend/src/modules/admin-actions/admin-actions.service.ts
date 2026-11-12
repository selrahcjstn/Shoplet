import { Injectable } from '@nestjs/common';
import { definedOnly } from '../../common/utils/defined-only.js';
import { db } from '../../prisma/db.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.js';
import { CreateAdminActionDto, AdminActionResponseDto } from './dto/index.js';

const rows = () => db.orm.public.AdminAction;

@Injectable()
export class AdminActionService {
  async create(
    dto: CreateAdminActionDto,
    user: AuthenticatedUser,
  ): Promise<AdminActionResponseDto> {
    return rows().create({ ...dto, adminId: user.id });
  }

  async findAll(): Promise<AdminActionResponseDto[]> {
    return await rows().all();
  }
}
