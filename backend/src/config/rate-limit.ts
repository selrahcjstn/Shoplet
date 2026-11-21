import { Throttle } from '@nestjs/throttler';

const MINUTE = 60_000;

/**
 * Requests allowed per client IP per minute. Generous enough that a real person never notices,
 * tight enough to stop password guessing, sign-up spam and fake analytics floods.
 */
export const RATE_LIMITS = {
  /** Every route unless it says otherwise. */
  default: { ttl: MINUTE, limit: 120 },
  /** Logging in and signing up: slows down password guessing. */
  auth: { ttl: MINUTE, limit: 10 },
  /** Public visit, view and click counters. */
  tracking: { ttl: MINUTE, limit: 60 },
  /** Signed photo uploads. */
  uploads: { ttl: MINUTE, limit: 30 },
} as const;

export const RATE_LIMIT_MESSAGE =
  'Too many requests. Please wait a moment and try again.';

/** Applies one of the named limits above to a route or controller. */
export const RateLimit = (name: Exclude<keyof typeof RATE_LIMITS, 'default'>) =>
  Throttle({ default: RATE_LIMITS[name] });
