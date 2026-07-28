export type OnboardingStep =
  | 'T0'
  | 'T1'
  | 'T2'
  | 'T2B'
  | 'E8'
  | 'E3'
  | 'T3'
  | 'T4'
  | 'T5'
  | 'E6'
  | 'T6'
  | 'C1';

/**
 * Momar corrected sequence (PM 2026-07-27):
 * E1 → E2 → E8 mandat → E4 versement → E5 (KYC + Intouch) → C1.
 * E3 remains only as a legacy resume alias for accounts created before this sequence.
 */
export const ONBOARDING_VISIBLE_STEPS = 6;

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
  /** Furthest completed/reachable step. Keeps a persisted Back action after refresh. */
  maxStep?: OnboardingStep;
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

/** True while the user has not finished onboarding (C1). Legacy T6 counts as finished. */
export function isOnboardingInProgress(raw: unknown): boolean {
  const step = readOnboardingProgress(raw).step;
  return step == null || (step !== 'C1' && step !== 'T6');
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
