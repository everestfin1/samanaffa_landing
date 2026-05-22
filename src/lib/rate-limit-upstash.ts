/**
 * Optional Upstash Redis rate limiting (AUTH-022).
 * Falls back to in-memory limits in rate-limit.ts when env is unset.
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { RateLimitResult } from './rate-limit';

export type UpstashLimitType = 'login' | 'otp' | 'otpVerify' | 'kyc' | 'transaction' | 'admin';

const DEFAULT_WINDOWS: Record<UpstashLimitType, { limit: number; windowSec: number }> = {
  admin: { limit: 5, windowSec: 900 },
  login: { limit: 5, windowSec: 900 },
  otp: { limit: 3, windowSec: 3600 },
  otpVerify: { limit: 5, windowSec: 900 },
  transaction: { limit: 10, windowSec: 60 },
  kyc: { limit: 5, windowSec: 3600 },
};

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

function getLimitConfig(type: UpstashLimitType): { limit: number; windowSec: number } {
  const defaults = DEFAULT_WINDOWS[type];
  switch (type) {
    case 'admin':
      return {
        limit: envInt('ADMIN_RATE_LIMIT_MAX_ATTEMPTS', defaults.limit),
        windowSec: Math.max(
          1,
          Math.floor(envInt('ADMIN_RATE_LIMIT_WINDOW_MS', defaults.windowSec * 1000) / 1000),
        ),
      };
    case 'login':
      return {
        limit: envInt('LOGIN_RATE_LIMIT_MAX_ATTEMPTS', defaults.limit),
        windowSec: Math.max(
          1,
          Math.floor(envInt('LOGIN_RATE_LIMIT_WINDOW_MS', defaults.windowSec * 1000) / 1000),
        ),
      };
    case 'otp':
      return {
        limit: envInt('OTP_RATE_LIMIT_MAX_ATTEMPTS', defaults.limit),
        windowSec: Math.max(
          1,
          Math.floor(envInt('OTP_RATE_LIMIT_WINDOW_MS', defaults.windowSec * 1000) / 1000),
        ),
      };
    case 'otpVerify':
      return {
        limit: envInt('OTP_VERIFY_RATE_LIMIT_MAX_ATTEMPTS', defaults.limit),
        windowSec: Math.max(
          1,
          Math.floor(envInt('OTP_VERIFY_RATE_LIMIT_WINDOW_MS', defaults.windowSec * 1000) / 1000),
        ),
      };
    case 'transaction':
      return {
        limit: envInt('TRANSACTION_RATE_LIMIT_MAX_ATTEMPTS', defaults.limit),
        windowSec: Math.max(
          1,
          Math.floor(
            envInt('TRANSACTION_RATE_LIMIT_WINDOW_MS', defaults.windowSec * 1000) / 1000,
          ),
        ),
      };
    case 'kyc':
      return {
        limit: envInt('KYC_RATE_LIMIT_MAX_ATTEMPTS', defaults.limit),
        windowSec: Math.max(
          1,
          Math.floor(envInt('KYC_RATE_LIMIT_WINDOW_MS', defaults.windowSec * 1000) / 1000),
        ),
      };
  }
}

let redis: Redis | null = null;
const limiters = new Map<UpstashLimitType, Ratelimit>();

export function isUpstashRateLimitEnabled(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function getLimiter(type: UpstashLimitType): Ratelimit {
  const cached = limiters.get(type);
  if (cached) return cached;

  if (!redis) {
    redis = Redis.fromEnv();
  }

  const cfg = getLimitConfig(type);
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(cfg.limit, `${cfg.windowSec} s`),
    prefix: `rl:${type}`,
  });

  limiters.set(type, limiter);
  return limiter;
}

/** Upstash `reset` is milliseconds since epoch (same as in-memory limiter). */
export async function consumeUpstashRateLimit(
  type: UpstashLimitType,
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

export function getUpstashLimitWindowMs(type: UpstashLimitType): number {
  return getLimitConfig(type).windowSec * 1000;
}
