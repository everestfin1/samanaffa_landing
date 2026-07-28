export type DefaultOnboardingAccount = {
  productCode: string;
  productName: string;
  interestRate: number;
  lockPeriodMonths: number;
  allowAdditionalDeposits: boolean;
};

/** Client-safe fallback used before a back-office setting is introduced. */
export const DEFAULT_ONBOARDING_ACCOUNT: DefaultOnboardingAccount = {
  productCode: 'SN-DEFAULT',
  productName: 'Naffa Classique',
  interestRate: 4.5,
  lockPeriodMonths: 12,
  allowAdditionalDeposits: true,
};

export function getDefaultOnboardingAccount(): DefaultOnboardingAccount {
  return DEFAULT_ONBOARDING_ACCOUNT;
}
