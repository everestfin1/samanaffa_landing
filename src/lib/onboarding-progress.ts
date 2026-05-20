export type OnboardingStep = 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6';

export interface OnboardingProgressPayload {
  step: OnboardingStep;
  simulation?: unknown;
  firstName?: string | null;
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
