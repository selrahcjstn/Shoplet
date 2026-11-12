import { ApiProperty } from '@nestjs/swagger';

export type UserRole = 'SELLER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';

/** Public shape of a user. Never includes passwordHash. */
export class UserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: ['SELLER', 'ADMIN'] })
  role!: UserRole;

  @ApiProperty({ enum: ['ACTIVE', 'SUSPENDED'] })
  status!: UserStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static from(user: UserResponseDto & { passwordHash?: string }): UserResponseDto {
    const { id, fullName, email, role, status, createdAt, updatedAt } = user;
    return { id, fullName, email, role, status, createdAt, updatedAt };
  }
}
