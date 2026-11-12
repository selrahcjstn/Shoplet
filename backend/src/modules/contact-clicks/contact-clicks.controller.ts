import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreateContactClickDto, ContactClickResponseDto } from './dto/index.js';
import { ContactClickService } from './contact-clicks.service.js';

@ApiTags('contact-clicks')
@Controller('contact-clicks')
export class ContactClickController {
  constructor(private readonly service: ContactClickService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create ContactClick' })
  @ApiCreatedResponse({ type: ContactClickResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() dto: CreateContactClickDto): Promise<ContactClickResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @ApiOperation({ summary: 'List ContactClick records' })
  @ApiOkResponse({ type: ContactClickResponseDto, isArray: true })
  findAll(): Promise<ContactClickResponseDto[]> {
    return this.service.findAll();
  }
}
