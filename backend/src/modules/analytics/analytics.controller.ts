import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.js';
import { AnalyticsService } from './analytics.service.js';
import { AnalyticsQueryDto, AnalyticsResponseDto } from './dto/index.js';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('shops/:shopId')
  @ApiOperation({ summary: 'Views and contact clicks for one shop' })
  @ApiOkResponse({ type: AnalyticsResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid days or timezone' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'You do not have access to this shop' })
  @ApiNotFoundResponse({ description: 'Shop not found' })
  forShop(
    @Param('shopId', ParseUUIDPipe) shopId: string,
    @Query() query: AnalyticsQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AnalyticsResponseDto> {
    return this.service.forShop(shopId, user, query.days, query.timezone);
  }
}
