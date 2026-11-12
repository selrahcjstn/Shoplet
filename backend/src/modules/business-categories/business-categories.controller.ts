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
  CreateBusinessCategoryDto,
  UpdateBusinessCategoryDto,
  BusinessCategoryResponseDto,
} from './dto/index.js';
import { BusinessCategoryService } from './business-categories.service.js';

@ApiTags('business-categories')
@Controller('business-categories')
export class BusinessCategoryController {
  constructor(private readonly service: BusinessCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create BusinessCategory' })
  @ApiCreatedResponse({ type: BusinessCategoryResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(
    @Body() dto: CreateBusinessCategoryDto,
  ): Promise<BusinessCategoryResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List BusinessCategory records' })
  @ApiOkResponse({ type: BusinessCategoryResponseDto, isArray: true })
  findAll(): Promise<BusinessCategoryResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get BusinessCategory by id' })
  @ApiOkResponse({ type: BusinessCategoryResponseDto })
  @ApiNotFoundResponse({ description: 'BusinessCategory not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BusinessCategoryResponseDto> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update BusinessCategory' })
  @ApiOkResponse({ type: BusinessCategoryResponseDto })
  @ApiNotFoundResponse({ description: 'BusinessCategory not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBusinessCategoryDto,
  ): Promise<BusinessCategoryResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete BusinessCategory' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'BusinessCategory not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.service.remove(id);
  }
}
