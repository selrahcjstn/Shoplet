import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateStoreViewDto, StoreViewResponseDto } from './dto/index.js';
import { StoreViewService } from './store-views.service.js';

@ApiTags('store-views')
@Controller('store-views')
export class StoreViewController {
  constructor(private readonly service: StoreViewService) {}

  @Post()
  @ApiOperation({ summary: 'Create StoreView' })
  @ApiCreatedResponse({ type: StoreViewResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() dto: CreateStoreViewDto): Promise<StoreViewResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List StoreView records' })
  @ApiOkResponse({ type: StoreViewResponseDto, isArray: true })
  findAll(): Promise<StoreViewResponseDto[]> {
    return this.service.findAll();
  }
}
