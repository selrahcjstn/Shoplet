import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateContactClickDto, ContactClickResponseDto } from './dto/index.js';
import { ContactClickService } from './contact-clicks.service.js';

@ApiTags('contact-clicks')
@Controller('contact-clicks')
export class ContactClickController {
  constructor(private readonly service: ContactClickService) {}

  @Post()
  @ApiOperation({ summary: 'Create ContactClick' })
  @ApiCreatedResponse({ type: ContactClickResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() dto: CreateContactClickDto): Promise<ContactClickResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List ContactClick records' })
  @ApiOkResponse({ type: ContactClickResponseDto, isArray: true })
  findAll(): Promise<ContactClickResponseDto[]> {
    return this.service.findAll();
  }
}
