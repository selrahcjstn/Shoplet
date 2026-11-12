import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/index.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.js';
import { UsersService } from './users.service.js';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @ApiOperation({ summary: 'Create a user' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiConflictResponse({ description: 'Email already in use' })
  create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }

  @Get()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  getMe(@CurrentUser() user: AuthenticatedUser): Promise<UserResponseDto> {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the authenticated user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiConflictResponse({ description: 'Email already in use' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(user.id, dto);
  }

  @Get(':id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiConflictResponse({ description: 'Email already in use' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, dto);
  }
}
