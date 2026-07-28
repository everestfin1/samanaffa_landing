/**
 * Dev/test only: allow skipping the onboarding first deposit ("Plus tard").
 * Driven by NEXT_PUBLIC_ONBOARDING_PAYMENT_BYPASS so the client can hide the CTA.
 * Never active in production (NODE_ENV or VERCEL_ENV).
 */
export function isOnboardingPaymentBypassEnabled(): boolean {
  if (process.env.NODE_ENV === 'production') return false;
  if (process.env.VERCEL_ENV === 'production') return false;

  const raw = (
    process.env.NEXT_PUBLIC_ONBOARDING_PAYMENT_BYPASS ??
    process.env.ONBOARDING_PAYMENT_BYPASS
  )
    ?.trim()
    .toLowerCase();

  return raw === 'true' || raw === '1' || raw === 'yes';
}
