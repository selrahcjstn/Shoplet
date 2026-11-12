import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateProductImageDto,
  UpdateProductImageDto,
  ProductImageResponseDto,
} from './dto/index.js';
import { ProductImageService } from './product-images.service.js';

@ApiTags('product-images')
@Controller('product-images')
export class ProductImageController {
  constructor(private readonly service: ProductImageService) {}

  @Post()
  @ApiOperation({ summary: 'Create ProductImage' })
  @ApiCreatedResponse({ type: ProductImageResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() dto: CreateProductImageDto): Promise<ProductImageResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List ProductImage records' })
  @ApiOkResponse({ type: ProductImageResponseDto, isArray: true })
  findAll(): Promise<ProductImageResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ProductImage by id' })
  @ApiOkResponse({ type: ProductImageResponseDto })
  @ApiNotFoundResponse({ description: 'ProductImage not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductImageResponseDto> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ProductImage' })
  @ApiOkResponse({ type: ProductImageResponseDto })
  @ApiNotFoundResponse({ description: 'ProductImage not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductImageDto,
  ): Promise<ProductImageResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete ProductImage' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'ProductImage not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.service.remove(id);
  }
}
