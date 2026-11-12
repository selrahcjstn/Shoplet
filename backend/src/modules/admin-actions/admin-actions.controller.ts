import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.js';
import { CreateAdminActionDto, AdminActionResponseDto } from './dto/index.js';
import { AdminActionService } from './admin-actions.service.js';

@ApiTags('admin-actions')
@Controller('admin-actions')
export class AdminActionController {
  constructor(private readonly service: AdminActionService) {}

  @Post()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @ApiOperation({ summary: 'Create AdminAction' })
  @ApiCreatedResponse({ type: AdminActionResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(
    @Body() dto: CreateAdminActionDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AdminActionResponseDto> {
    return this.service.create(dto, user);
  }

  @Get()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @ApiOperation({ summary: 'List AdminAction records' })
  @ApiOkResponse({ type: AdminActionResponseDto, isArray: true })
  findAll(): Promise<AdminActionResponseDto[]> {
    return this.service.findAll();
  }
}
