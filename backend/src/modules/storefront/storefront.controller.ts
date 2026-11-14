import { Controller, Get, Headers, Param } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator.js';
import type {
  AuthenticatedUser,
  JwtPayload,
} from '../auth/types/jwt-payload.js';
import { StorefrontResponseDto } from './dto/storefront-response.dto.js';
import { StorefrontService } from './storefront.service.js';

@ApiTags('storefront')
@Controller('storefront')
export class StorefrontController {
  constructor(
    private readonly service: StorefrontService,
    private readonly jwt: JwtService,
  ) {}

  @Get(':slug')
  @Public()
  @ApiOperation({
    summary: 'A published shop as customers see it',
    description:
      'Public. Send the owner token to preview a shop that is not published yet.',
  })
  @ApiOkResponse({ type: StorefrontResponseDto })
  @ApiNotFoundResponse({ description: 'Shop not found or not published' })
  async bySlug(
    @Param('slug') slug: string,
    @Headers('authorization') authorization?: string,
  ): Promise<StorefrontResponseDto> {
    return this.service.bySlug(slug, await this.viewerFrom(authorization));
  }

  /** The route is public, so a token is optional: a missing or invalid one just means "a customer". */
  private async viewerFrom(
    authorization?: string,
  ): Promise<AuthenticatedUser | null> {
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : null;
    if (!token) return null;
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token);
      return { id: payload.sub, role: payload.role };
    } catch {
      return null;
    }
  }
}
