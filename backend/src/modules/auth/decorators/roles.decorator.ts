import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../types/jwt-payload.js';

export const ROLES_KEY = 'roles';

/** Restricts a route to users with one of the given roles. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
