import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'node:crypto';
import { getJwtSecret } from '../../config/jwt.config.js';
import { db } from '../../prisma/db.js';

/** How long a shop page can keep counting after it was opened. */
const LIFETIME = '2h';
const KIND = 'track';
const REJECTED = 'This count could not be verified. Reload the shop page.';

interface TrackingPayload {
  sid: string;
  typ: typeof KIND;
}

/**
 * Short-lived signed tokens that prove a visit, product view or contact click came from someone
 * who actually opened the shop page. The storefront hands one out with the page; the counters only
 * accept a count that carries a valid token for the same shop.
 *
 * Tokens are signed with a key derived from JWT_SECRET, never with JWT_SECRET itself, so a tracking
 * token can never pass as a login token or the other way round.
 */
@Injectable()
export class TrackingTokenService {
  private readonly secret = createHash('sha256')
    .update(`${getJwtSecret()}:tracking-tokens`)
    .digest('hex');

  constructor(private readonly jwt: JwtService) {}

  sign(shopId: string): Promise<string> {
    const payload: TrackingPayload = { sid: shopId, typ: KIND };
    return this.jwt.signAsync(payload, {
      secret: this.secret,
      expiresIn: LIFETIME,
    });
  }

  /** Passes only for a valid, unexpired tracking token issued for this shop. */
  async assertShop(token: string, shopId: string): Promise<void> {
    let payload: TrackingPayload;
    try {
      payload = await this.jwt.verifyAsync<TrackingPayload>(token, {
        secret: this.secret,
      });
    } catch {
      throw new ForbiddenException(REJECTED);
    }
    if (payload.typ !== KIND || payload.sid !== shopId) {
      throw new ForbiddenException(REJECTED);
    }
  }

  /** Same check for a product, through the shop it belongs to. */
  async assertProduct(token: string, productId: string): Promise<string> {
    const product = await db.orm.public.Product.where({
      id: productId,
    }).first();
    if (!product) throw new NotFoundException('Product not found');
    await this.assertShop(token, product.shopId);
    return product.shopId;
  }
}
