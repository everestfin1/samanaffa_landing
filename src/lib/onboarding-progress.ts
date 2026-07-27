export type OnboardingStep =
  | 'T0'
  | 'T1'
  | 'T2'
  | 'T2B'
  | 'E3'
  | 'T3'
  | 'T4'
  | 'T5'
  | 'E6'
  | 'E8'
  | 'T6';

/** Momar visible steps: E1 → E2 → E2B (contact/consents) → E3 → E4 → E5 → E6 pay → E8 mandat → T6. */
export const ONBOARDING_VISIBLE_STEPS = 9;

/** @deprecated Quiz removed from Momar flow — kept for older imports. */
export const ONBOARDING_QUIZ_QUESTIONS = 0;

/** Default product label when quiz is skipped (maps to Naffa « sérénité »). */
export const DEFAULT_ONBOARDING_FORMULA = 'Formule Équilibre';

/** Fill width (0–100) for the top onboarding progress bar. */
export function getOnboardingProgressPercent(visibleStep: number): number {
  if (visibleStep <= 0) return 0;
  return (visibleStep / ONBOARDING_VISIBLE_STEPS) * 100;
}

export interface OnboardingProgressPayload {
  step: OnboardingStep;
  simulation?: unknown;
  firstName?: string | null;
  /** Validated sponsor/referral code from `ape_sponsor_codes`. */
  referralCode?: string | null;
  formula?: string | null;
  depositAmount?: number | null;
  wallet?: string | null;
  /** @deprecated Server derives from user.kycStatus — never trust client */
  kycApproved?: boolean;
  /** One-time post-signup session exchange (AUTH-002) */
  postSignupJti?: string;
  postSignupExpires?: string;
}

export function parseInvestorProfile(raw: unknown): Record<string, unknown> {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  return {};
}

export function readOnboardingProgress(raw: unknown): Partial<OnboardingProgressPayload> {
  const profile = parseInvestorProfile(raw);
  const onboarding = profile.onboarding;
  if (onboarding && typeof onboarding === 'object' && !Array.isArray(onboarding)) {
    return onboarding as Partial<OnboardingProgressPayload>;
  }
  return {};
}

/** True while the user has not finished onboarding T6 (used to defer portal-only comms). */
export function isOnboardingInProgress(raw: unknown): boolean {
  const step = readOnboardingProgress(raw).step;
  return step == null || step !== 'T6';
}

export function mergeInvestorProfile(
  existing: unknown,
  patch: {
    onboarding?: Partial<OnboardingProgressPayload>;
    sessionVersion?: number;
    [key: string]: unknown;
  },
): Record<string, unknown> {
  const base = parseInvestorProfile(existing);
  const prevOnboarding = readOnboardingProgress(existing);
  const next: Record<string, unknown> = { ...base, ...patch };
  if (patch.onboarding) {
    next.onboarding = { ...prevOnboarding, ...patch.onboarding };
  }
  return next;
}
