import { afterEach, describe, expect, it, vi } from 'vitest';
import { isOnboardingPaymentBypassEnabled } from './onboarding-payment-bypass';

describe('isOnboardingPaymentBypassEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns false when the flag is not set', () => {
    vi.stubEnv('NEXT_PUBLIC_ONBOARDING_PAYMENT_BYPASS', 'false');
    vi.stubEnv('NODE_ENV', 'development');
    expect(isOnboardingPaymentBypassEnabled()).toBe(false);
  });

  it('returns true in local development when the flag is set', () => {
    vi.stubEnv('NEXT_PUBLIC_ONBOARDING_PAYMENT_BYPASS', 'true');
    vi.stubEnv('NODE_ENV', 'development');
    expect(isOnboardingPaymentBypassEnabled()).toBe(true);
  });

  it('returns true on Vercel preview even when NODE_ENV is production', () => {
    vi.stubEnv('NEXT_PUBLIC_ONBOARDING_PAYMENT_BYPASS', 'true');
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_APP_ENV', '');
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('NEXT_PUBLIC_VERCEL_ENV', 'preview');
    expect(isOnboardingPaymentBypassEnabled()).toBe(true);
  });

  it('returns true when NEXT_PUBLIC_APP_ENV is development (dev.samanaffa.com)', () => {
    vi.stubEnv('NEXT_PUBLIC_ONBOARDING_PAYMENT_BYPASS', 'true');
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'development');
    vi.stubEnv('VERCEL_ENV', '');
    vi.stubEnv('NEXT_PUBLIC_VERCEL_ENV', '');
    expect(isOnboardingPaymentBypassEnabled()).toBe(true);
  });

  it('returns false on Vercel production even if the flag is set', () => {
    vi.stubEnv('NEXT_PUBLIC_ONBOARDING_PAYMENT_BYPASS', 'true');
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'production');
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_VERCEL_ENV', 'production');
    expect(isOnboardingPaymentBypassEnabled()).toBe(false);
  });
});
