import { afterEach, describe, expect, it, vi } from 'vitest';
import { isMockOtpEnabled } from './mock-otp';

describe('isMockOtpEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns false when MOCK_OTP is not true', () => {
    vi.stubEnv('MOCK_OTP', 'false');
    vi.stubEnv('NODE_ENV', 'development');
    expect(isMockOtpEnabled()).toBe(false);
  });

  it('returns true in non-production when MOCK_OTP is true', () => {
    vi.stubEnv('MOCK_OTP', 'true');
    vi.stubEnv('NODE_ENV', 'development');
    expect(isMockOtpEnabled()).toBe(true);
  });

  it('returns true on srvstage when NEXT_PUBLIC_APP_ENV is staging', () => {
    vi.stubEnv('MOCK_OTP', 'true');
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'staging');
    vi.stubEnv('VERCEL_ENV', '');
    expect(isMockOtpEnabled()).toBe(true);
  });

  it('returns false in production without staging or vercel preview', () => {
    vi.stubEnv('MOCK_OTP', 'true');
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'production');
    vi.stubEnv('VERCEL_ENV', 'production');
    expect(isMockOtpEnabled()).toBe(false);
  });
});
