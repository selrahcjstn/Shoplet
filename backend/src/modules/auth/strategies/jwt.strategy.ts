import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getJwtSecret } from '../../../config/jwt.config.js';
import { UsersService } from '../../users/users.service.js';
import type { AuthenticatedUser, JwtPayload } from '../types/jwt-payload.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  /** Runs after signature and expiry checks pass. Becomes `request.user`. */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.usersService.findAuthById(payload.sub);
    if (!user || !user.isActive)
      throw new UnauthorizedException('Unauthorized');
    // Role comes from the database so role changes apply immediately.
    return { id: user.id, role: user.role };
  }
}
