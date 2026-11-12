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
import { CreateShopDto, UpdateShopDto, ShopResponseDto } from './dto/index.js';
import { ShopService } from './shops.service.js';

@ApiTags('shops')
@Controller('shops')
export class ShopController {
  constructor(private readonly service: ShopService) {}

  @Post()
  @ApiOperation({ summary: 'Create Shop' })
  @ApiCreatedResponse({ type: ShopResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() dto: CreateShopDto): Promise<ShopResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List Shop records' })
  @ApiOkResponse({ type: ShopResponseDto, isArray: true })
  findAll(): Promise<ShopResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Shop by id' })
  @ApiOkResponse({ type: ShopResponseDto })
  @ApiNotFoundResponse({ description: 'Shop not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ShopResponseDto> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Shop' })
  @ApiOkResponse({ type: ShopResponseDto })
  @ApiNotFoundResponse({ description: 'Shop not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateShopDto,
  ): Promise<ShopResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete Shop' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Shop not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.service.remove(id);
  }
}
