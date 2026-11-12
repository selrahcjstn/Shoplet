import { Injectable } from '@nestjs/common';
import { db } from '../../prisma/db.js';

export interface CreateUserInput {
  fullName: string;
  email: string;
  passwordHash: string;
  role?: 'SELLER' | 'ADMIN';
}

export interface UpdateUserInput {
  fullName?: string;
  email?: string;
  status?: 'ACTIVE' | 'SUSPENDED';
}

const users = () => db.orm.public.User;

@Injectable()
export class UsersService {
  create(input: CreateUserInput) {
    return users().create({
      ...input,
      email: input.email.trim().toLowerCase(),
    });
  }

  findAll() {
    return users().all();
  }

  findById(id: string) {
    return users().where({ id }).first();
  }

  findByEmail(email: string) {
    return users().where({ email: email.trim().toLowerCase() }).first();
  }

  update(id: string, input: UpdateUserInput) {
    return users().where({ id }).update(input);
  }
}
