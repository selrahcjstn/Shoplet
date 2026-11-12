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
  CreateShopContactDto,
  UpdateShopContactDto,
  ShopContactResponseDto,
} from './dto/index.js';
import { ShopContactService } from './shop-contacts.service.js';

@ApiTags('shop-contacts')
@Controller('shop-contacts')
export class ShopContactController {
  constructor(private readonly service: ShopContactService) {}

  @Post()
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @ApiOperation({ summary: 'Create ShopContact' })
  @ApiCreatedResponse({ type: ShopContactResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(
    @Body() dto: CreateShopContactDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ShopContactResponseDto> {
    return this.service.create(dto, user);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List ShopContact records' })
  @ApiOkResponse({ type: ShopContactResponseDto, isArray: true })
  findAll(): Promise<ShopContactResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get ShopContact by id' })
  @ApiOkResponse({ type: ShopContactResponseDto })
  @ApiNotFoundResponse({ description: 'ShopContact not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ShopContactResponseDto> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @ApiOperation({ summary: 'Update ShopContact' })
  @ApiOkResponse({ type: ShopContactResponseDto })
  @ApiNotFoundResponse({ description: 'ShopContact not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateShopContactDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ShopContactResponseDto> {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete ShopContact' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'ShopContact not found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.service.remove(id, user);
  }
}
