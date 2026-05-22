/**
 * Optional Upstash Redis rate limiting (AUTH-022).
 * Falls back to in-memory limits in rate-limit.ts when env is unset.
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { RateLimitResult } from './rate-limit';

type LimitType = 'login' | 'otp' | 'otpVerify' | 'kyc' | 'transaction' | 'admin';

const LIMIT_WINDOWS: Record<LimitType, { limit: number; windowSec: number }> = {
  admin: { limit: 5, windowSec: 900 },
  login: { limit: 5, windowSec: 900 },
  otp: { limit: 3, windowSec: 3600 },
  otpVerify: { limit: 5, windowSec: 900 },
  transaction: { limit: 10, windowSec: 60 },
  kyc: { limit: 5, windowSec: 3600 },
};

let redis: Redis | null = null;
const limiters = new Map<LimitType, Ratelimit>();

export function isUpstashRateLimitEnabled(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function getLimiter(type: LimitType): Ratelimit {
  const cached = limiters.get(type);
  if (cached) return cached;

  if (!redis) {
    redis = Redis.fromEnv();
  }

  const cfg = LIMIT_WINDOWS[type];
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(cfg.limit, `${cfg.windowSec} s`),
    prefix: `rl:${type}`,
  });

  limiters.set(type, limiter);
  return limiter;
}

export async function consumeUpstashRateLimit(
  type: LimitType,
  key: string,
): Promise<RateLimitResult> {
  const limiter = getLimiter(type);
  const result = await limiter.limit(key);

  return {
    allowed: result.success,
    remaining: result.remaining,
    resetTime: result.reset,
    blocked: !result.success,
  };
}
