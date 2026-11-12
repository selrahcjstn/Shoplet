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
import { Public } from '../auth/decorators/public.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
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
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @ApiOperation({ summary: 'Create BusinessCategory' })
  @ApiCreatedResponse({ type: BusinessCategoryResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(
    @Body() dto: CreateBusinessCategoryDto,
  ): Promise<BusinessCategoryResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List BusinessCategory records' })
  @ApiOkResponse({ type: BusinessCategoryResponseDto, isArray: true })
  findAll(): Promise<BusinessCategoryResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get BusinessCategory by id' })
  @ApiOkResponse({ type: BusinessCategoryResponseDto })
  @ApiNotFoundResponse({ description: 'BusinessCategory not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BusinessCategoryResponseDto> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
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
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete BusinessCategory' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'BusinessCategory not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.service.remove(id);
  }
}
