/**
 * Dev/test only: allow skipping the onboarding first deposit ("Plus tard").
 * Driven by NEXT_PUBLIC_ONBOARDING_PAYMENT_BYPASS so the client can show the CTA.
 *
 * Same gate model as mock OTP:
 * - local (NODE_ENV !== production), or
 * - staging / development / test (`NEXT_PUBLIC_APP_ENV`), or
 * - Vercel Preview / `vercel dev`
 * Never on Vercel Production / APP_ENV=production.
 *
 * Note: Vercel preview builds use NODE_ENV=production — that alone must not block.
 */
export function isOnboardingPaymentBypassEnabled(): boolean {
  const raw = (
    process.env.NEXT_PUBLIC_ONBOARDING_PAYMENT_BYPASS ??
    process.env.ONBOARDING_PAYMENT_BYPASS
  )
    ?.trim()
    .toLowerCase();

  if (raw !== 'true' && raw !== '1' && raw !== 'yes') return false;

  if (process.env.VERCEL_ENV === 'production') return false;
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') return false;
  if (process.env.NEXT_PUBLIC_APP_ENV === 'production') return false;

  if (process.env.NODE_ENV !== 'production') return true;

  const appEnv = process.env.NEXT_PUBLIC_APP_ENV?.trim().toLowerCase();
  if (appEnv === 'staging' || appEnv === 'development' || appEnv === 'test') {
    return true;
  }

  // Prefer NEXT_PUBLIC_VERCEL_ENV on the client (VERCEL_ENV is not inlined there).
  const vercelEnv =
    process.env.NEXT_PUBLIC_VERCEL_ENV?.trim() || process.env.VERCEL_ENV?.trim();
  return vercelEnv === 'preview' || vercelEnv === 'development';
}
