export type UserRole = 'SELLER' | 'ADMIN';

/** Claims stored inside the signed access token. */
export interface JwtPayload {
  sub: string;
  role: UserRole;
}

/** Identity placed on `request.user` after the token is validated. */
export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}
