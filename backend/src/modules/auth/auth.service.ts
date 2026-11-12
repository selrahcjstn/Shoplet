import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserResponseDto } from '../users/dto/index.js';
import { UsersService } from '../users/users.service.js';
import { AuthResponseDto, LoginDto, RegisterDto } from './dto/index.js';
import type { JwtPayload } from './types/jwt-payload.js';

// Compared against when the email is unknown, so response time doesn't reveal it.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  register(dto: RegisterDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findAuthByEmail(dto.email);
    const valid = await bcrypt.compare(
      dto.password,
      user?.passwordHash ?? DUMMY_HASH,
    );
    if (!user || !valid || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user.id, role: user.role };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      tokenType: 'Bearer',
      user: UserResponseDto.from(user),
    };
  }
}
