import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/index.js';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';

  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;
}
