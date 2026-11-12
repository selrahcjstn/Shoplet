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
import { Public } from '../auth/decorators/public.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreateStoreViewDto, StoreViewResponseDto } from './dto/index.js';
import { StoreViewService } from './store-views.service.js';

@ApiTags('store-views')
@Controller('store-views')
export class StoreViewController {
  constructor(private readonly service: StoreViewService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create StoreView' })
  @ApiCreatedResponse({ type: StoreViewResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() dto: CreateStoreViewDto): Promise<StoreViewResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @ApiOperation({ summary: 'List StoreView records' })
  @ApiOkResponse({ type: StoreViewResponseDto, isArray: true })
  findAll(): Promise<StoreViewResponseDto[]> {
    return this.service.findAll();
  }
}
