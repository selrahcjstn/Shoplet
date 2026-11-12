import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @MaxLength(255, { message: 'Email must be at most 255 characters' })
  @ApiProperty({ example: 'juan@example.com' })
  email!: string;

  // No complexity rules here: login only checks the password is present.
  @IsString({ message: 'Password must be text' })
  @IsNotEmpty({ message: 'Password is required' })
  @MaxLength(72, { message: 'Password must be at most 72 characters long' })
  @ApiProperty({ format: 'password' })
  password!: string;
}
