import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { definedOnly } from '../../common/utils/defined-only.js';
import { db } from '../../prisma/db.js';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/index.js';

const users = () => db.orm.public.User;

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UsersService {
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    if (await users().where({ email: dto.email }).first()) {
      throw new ConflictException('Email already in use');
    }
    const user = await users().create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      passwordHash: await bcrypt.hash(dto.password, BCRYPT_ROUNDS),
    });
    return UserResponseDto.from(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const rows = await users().all();
    return rows.map((u) => UserResponseDto.from(u));
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await users().where({ id }).first();
    if (!user) throw new NotFoundException('User not found');
    return UserResponseDto.from(user);
  }

  /** For AuthModule: includes passwordHash and role. Never return from controllers. */
  findAuthByEmail(email: string) {
    return users().where({ email: email.trim().toLowerCase() }).first();
  }

  /** For JwtStrategy: includes role and isActive. Never return from controllers. */
  findAuthById(id: string) {
    return users().where({ id }).first();
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    await this.findById(id);
    if (dto.email) {
      const taken = await users().where({ email: dto.email }).first();
      if (taken && taken.id !== id)
        throw new ConflictException('Email already in use');
    }
    const user = await users().where({ id }).update(definedOnly(dto));
    if (!user) throw new NotFoundException('User not found');
    return UserResponseDto.from(user);
  }
}
