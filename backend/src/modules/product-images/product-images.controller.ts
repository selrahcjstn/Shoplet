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
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @ApiOperation({ summary: 'Create ProductImage' })
  @ApiCreatedResponse({ type: ProductImageResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(
    @Body() dto: CreateProductImageDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ProductImageResponseDto> {
    return this.service.create(dto, user);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List ProductImage records' })
  @ApiOkResponse({ type: ProductImageResponseDto, isArray: true })
  findAll(): Promise<ProductImageResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get ProductImage by id' })
  @ApiOkResponse({ type: ProductImageResponseDto })
  @ApiNotFoundResponse({ description: 'ProductImage not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductImageResponseDto> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @ApiOperation({ summary: 'Update ProductImage' })
  @ApiOkResponse({ type: ProductImageResponseDto })
  @ApiNotFoundResponse({ description: 'ProductImage not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductImageDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ProductImageResponseDto> {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete ProductImage' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'ProductImage not found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.service.remove(id, user);
  }
}
