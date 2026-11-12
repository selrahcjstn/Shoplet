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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Public } from '../auth/decorators/public.decorator.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.js';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from './dto/index.js';
import { ProductService } from './products.service.js';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Post()
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @ApiOperation({ summary: 'Create Product' })
  @ApiCreatedResponse({ type: ProductResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ProductResponseDto> {
    return this.service.create(dto, user);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List Product records' })
  @ApiOkResponse({ type: ProductResponseDto, isArray: true })
  findAll(): Promise<ProductResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get Product by id' })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiNotFoundResponse({ description: 'Product not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProductResponseDto> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @ApiOperation({ summary: 'Update Product' })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiNotFoundResponse({ description: 'Product not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ProductResponseDto> {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete Product' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Product not found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.service.remove(id, user);
  }
}
