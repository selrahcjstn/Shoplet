import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAdminActionDto, AdminActionResponseDto } from './dto/index.js';
import { AdminActionService } from './admin-actions.service.js';

@ApiTags('admin-actions')
@Controller('admin-actions')
export class AdminActionController {
  constructor(private readonly service: AdminActionService) {}

  @Post()
  @ApiOperation({ summary: 'Create AdminAction' })
  @ApiCreatedResponse({ type: AdminActionResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() dto: CreateAdminActionDto): Promise<AdminActionResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List AdminAction records' })
  @ApiOkResponse({ type: AdminActionResponseDto, isArray: true })
  findAll(): Promise<AdminActionResponseDto[]> {
    return this.service.findAll();
  }
}
