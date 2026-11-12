import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(255)
  @ApiProperty({ example: 'juan@example.com' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  @ApiProperty({ format: 'password' })
  password!: string;
}
