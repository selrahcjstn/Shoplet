import { Injectable } from '@nestjs/common';
import { db } from '../../prisma/db.js';
import { CreateAdminActionDto, AdminActionResponseDto } from './dto/index.js';

const rows = () => db.orm.public.AdminAction;

@Injectable()
export class AdminActionService {
  create(dto: CreateAdminActionDto): Promise<AdminActionResponseDto> {
    return rows().create(dto);
  }

  async findAll(): Promise<AdminActionResponseDto[]> {
    return await rows().all();
  }
}
