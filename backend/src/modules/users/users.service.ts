import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';
import { db } from '../../prisma/db.js';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/index.js';

const scryptAsync = promisify(scrypt);
const users = () => db.orm.public.User;

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`;
}

@Injectable()
export class UsersService {
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    if (await users().where({ email: dto.email }).first()) {
      throw new ConflictException('Email already in use');
    }
    const user = await users().create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash: await hashPassword(dto.password),
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

  /** For AuthModule: includes passwordHash. Do not return from controllers. */
  findByEmailWithHash(email: string) {
    return users().where({ email: email.trim().toLowerCase() }).first();
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    await this.findById(id);
    if (dto.email) {
      const taken = await users().where({ email: dto.email }).first();
      if (taken && taken.id !== id) throw new ConflictException('Email already in use');
    }
    const user = await users().where({ id }).update(dto);
    if (!user) throw new NotFoundException('User not found');
    return UserResponseDto.from(user);
  }
}
