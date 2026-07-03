import { afterEach, describe, expect, it } from 'vitest';
import { isMockOtpEnabled } from './mock-otp';

describe('isMockOtpEnabled', () => {
  const env = process.env;

  afterEach(() => {
    process.env = { ...env };
  });

  it('returns false when MOCK_OTP is not true', () => {
    process.env.MOCK_OTP = 'false';
    process.env.NODE_ENV = 'development';
    expect(isMockOtpEnabled()).toBe(false);
  });

  it('returns true in non-production when MOCK_OTP is true', () => {
    process.env.MOCK_OTP = 'true';
    process.env.NODE_ENV = 'development';
    expect(isMockOtpEnabled()).toBe(true);
  });

  it('returns true on srvstage when NEXT_PUBLIC_APP_ENV is staging', () => {
    process.env.MOCK_OTP = 'true';
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_APP_ENV = 'staging';
    delete process.env.VERCEL_ENV;
    expect(isMockOtpEnabled()).toBe(true);
  });

  it('returns false in production without staging or vercel preview', () => {
    process.env.MOCK_OTP = 'true';
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_APP_ENV = 'production';
    process.env.VERCEL_ENV = 'production';
    expect(isMockOtpEnabled()).toBe(false);
  });
});
