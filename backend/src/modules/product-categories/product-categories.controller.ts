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
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
  ProductCategoryResponseDto,
} from './dto/index.js';
import { ProductCategoryService } from './product-categories.service.js';

@ApiTags('product-categories')
@Controller('product-categories')
export class ProductCategoryController {
  constructor(private readonly service: ProductCategoryService) {}

  @Post()
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @ApiOperation({ summary: 'Create ProductCategory' })
  @ApiCreatedResponse({ type: ProductCategoryResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(
    @Body() dto: CreateProductCategoryDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ProductCategoryResponseDto> {
    return this.service.create(dto, user);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List ProductCategory records' })
  @ApiOkResponse({ type: ProductCategoryResponseDto, isArray: true })
  findAll(): Promise<ProductCategoryResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get ProductCategory by id' })
  @ApiOkResponse({ type: ProductCategoryResponseDto })
  @ApiNotFoundResponse({ description: 'ProductCategory not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductCategoryResponseDto> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @ApiOperation({ summary: 'Update ProductCategory' })
  @ApiOkResponse({ type: ProductCategoryResponseDto })
  @ApiNotFoundResponse({ description: 'ProductCategory not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductCategoryDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ProductCategoryResponseDto> {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete ProductCategory' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'ProductCategory not found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.service.remove(id, user);
  }
}
