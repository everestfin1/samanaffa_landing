/**
 * Mock OTP (no real SMS/email) when MOCK_OTP=true and:
 * - local dev (NODE_ENV !== 'production'), or
 * - Vercel Preview / `vercel dev` only — never Vercel Production.
 */
export function isMockOtpEnabled(): boolean {
  if (process.env.MOCK_OTP !== 'true') return false;

  if (process.env.NODE_ENV !== 'production') return true;

  const vercelEnv = process.env.VERCEL_ENV;
  return vercelEnv === 'preview' || vercelEnv === 'development';
}
