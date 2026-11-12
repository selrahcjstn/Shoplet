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
import { CreateShopDto, UpdateShopDto, ShopResponseDto } from './dto/index.js';
import { ShopService } from './shops.service.js';

@ApiTags('shops')
@Controller('shops')
export class ShopController {
  constructor(private readonly service: ShopService) {}

  @Post()
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @ApiOperation({ summary: 'Create Shop' })
  @ApiCreatedResponse({ type: ShopResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(
    @Body() dto: CreateShopDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ShopResponseDto> {
    return this.service.create(dto, user);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List Shop records' })
  @ApiOkResponse({ type: ShopResponseDto, isArray: true })
  findAll(): Promise<ShopResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get Shop by id' })
  @ApiOkResponse({ type: ShopResponseDto })
  @ApiNotFoundResponse({ description: 'Shop not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ShopResponseDto> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @ApiOperation({ summary: 'Update Shop' })
  @ApiOkResponse({ type: ShopResponseDto })
  @ApiNotFoundResponse({ description: 'Shop not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateShopDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ShopResponseDto> {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete Shop' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Shop not found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.service.remove(id, user);
  }
}
