import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'First name must be text' })
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(100, { message: 'First name must be at most 100 characters' })
  @ApiProperty({ example: 'Juan', maxLength: 100 })
  firstName!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Last name must be text' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MaxLength(100, { message: 'Last name must be at most 100 characters' })
  @ApiProperty({ example: 'Dela Cruz', maxLength: 100 })
  lastName!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @MaxLength(255, { message: 'Email must be at most 255 characters' })
  @ApiProperty({ example: 'juan@example.com' })
  email!: string;

  @IsString({ message: 'Password must be text' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  // bcrypt ignores everything after 72 bytes, so longer passwords are refused.
  @MaxLength(72, { message: 'Password must be at most 72 characters long' })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  @Matches(/[^A-Za-z0-9\s]/, {
    message:
      'Password must contain at least one special character (for example: ! @ # $ %)',
  })
  @ApiProperty({
    minLength: 8,
    maxLength: 72,
    format: 'password',
    example: 'Str0ng!Pass',
    description:
      'At least 8 characters with an uppercase letter, a lowercase letter, a number and a special character',
  })
  password!: string;
}
