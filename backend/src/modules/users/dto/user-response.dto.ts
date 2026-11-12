import { ApiProperty } from '@nestjs/swagger';

/** Public shape of a user. Never includes passwordHash. */
export class UserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({ type: Date, nullable: true })
  emailVerifiedAt!: Date | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static from(
    user: UserResponseDto & { passwordHash?: string },
  ): UserResponseDto {
    const {
      id,
      email,
      firstName,
      lastName,
      isActive,
      emailVerifiedAt,
      createdAt,
      updatedAt,
    } = user;
    return {
      id,
      email,
      firstName,
      lastName,
      isActive,
      emailVerifiedAt,
      createdAt,
      updatedAt,
    };
  }
}
