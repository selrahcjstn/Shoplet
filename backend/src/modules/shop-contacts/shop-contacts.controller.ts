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
  @ApiOperation({ summary: 'Create ShopContact' })
  @ApiCreatedResponse({ type: ShopContactResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() dto: CreateShopContactDto): Promise<ShopContactResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List ShopContact records' })
  @ApiOkResponse({ type: ShopContactResponseDto, isArray: true })
  findAll(): Promise<ShopContactResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ShopContact by id' })
  @ApiOkResponse({ type: ShopContactResponseDto })
  @ApiNotFoundResponse({ description: 'ShopContact not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ShopContactResponseDto> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ShopContact' })
  @ApiOkResponse({ type: ShopContactResponseDto })
  @ApiNotFoundResponse({ description: 'ShopContact not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateShopContactDto,
  ): Promise<ShopContactResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete ShopContact' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'ShopContact not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.service.remove(id);
  }
}
