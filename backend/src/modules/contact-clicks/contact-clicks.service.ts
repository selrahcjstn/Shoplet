import { Injectable } from '@nestjs/common';
import { definedOnly } from '../../common/utils/defined-only.js';
import { db } from '../../prisma/db.js';
import { CreateContactClickDto, ContactClickResponseDto } from './dto/index.js';

const rows = () => db.orm.public.ContactClick;

@Injectable()
export class ContactClickService {
  async create(dto: CreateContactClickDto): Promise<ContactClickResponseDto> {
    return rows().create(dto);
  }

  async findAll(): Promise<ContactClickResponseDto[]> {
    return await rows().all();
  }
}
