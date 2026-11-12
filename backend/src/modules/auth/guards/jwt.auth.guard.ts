import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Missing, malformed, expired and invalid tokens all get the same response.
  override handleRequest<TUser>(err: unknown, user: TUser | false): TUser {
    if (err || !user) throw new UnauthorizedException('Unauthorized');
    return user;
  }
}
