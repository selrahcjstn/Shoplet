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
import { CreateProductViewDto, ProductViewResponseDto } from './dto/index.js';
import { ProductViewService } from './product-views.service.js';

@ApiTags('product-views')
@Controller('product-views')
export class ProductViewController {
  constructor(private readonly service: ProductViewService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create ProductView' })
  @ApiCreatedResponse({ type: ProductViewResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() dto: CreateProductViewDto): Promise<ProductViewResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @ApiOperation({ summary: 'List ProductView records' })
  @ApiOkResponse({ type: ProductViewResponseDto, isArray: true })
  findAll(): Promise<ProductViewResponseDto[]> {
    return this.service.findAll();
  }
}
