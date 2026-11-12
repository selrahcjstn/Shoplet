import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductViewDto, ProductViewResponseDto } from './dto/index.js';
import { ProductViewService } from './product-views.service.js';

@ApiTags('product-views')
@Controller('product-views')
export class ProductViewController {
  constructor(private readonly service: ProductViewService) {}

  @Post()
  @ApiOperation({ summary: 'Create ProductView' })
  @ApiCreatedResponse({ type: ProductViewResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() dto: CreateProductViewDto): Promise<ProductViewResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List ProductView records' })
  @ApiOkResponse({ type: ProductViewResponseDto, isArray: true })
  findAll(): Promise<ProductViewResponseDto[]> {
    return this.service.findAll();
  }
}
