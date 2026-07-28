import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  DEFAULT_ONBOARDING_ACCOUNT_SETTINGS_ID,
  onboardingAccountSettings,
} from '@/lib/db/schema';
import {
  DEFAULT_ONBOARDING_ACCOUNT,
  type DefaultOnboardingAccount,
} from '@/lib/onboarding-default-account-config';

/**
 * Resolves the account determinant values used for a newly registered customer.
 * The singleton table lets the back office change future accounts without
 * changing previously opened accounts or deploying code.
 */
export async function resolveDefaultOnboardingAccount(): Promise<DefaultOnboardingAccount> {
  const [settings] = await db
    .select()
    .from(onboardingAccountSettings)
    .where(eq(onboardingAccountSettings.id, DEFAULT_ONBOARDING_ACCOUNT_SETTINGS_ID))
    .limit(1);

  if (!settings) return DEFAULT_ONBOARDING_ACCOUNT;

  return {
    productCode: settings.productCode,
    productName: settings.productName,
    interestRate: Number(settings.interestRate),
    lockPeriodMonths: settings.lockPeriodMonths,
    allowAdditionalDeposits: settings.allowAdditionalDeposits,
  };
}
