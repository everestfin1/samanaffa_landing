import { db } from '@/lib/db';
import { transactionIntents } from '@/lib/db/schema';
import { and, desc, eq, like } from 'drizzle-orm';

/** Structured marker for onboarding T4 deposit intents (ONB-027). */
export const ONBOARDING_DEPOSIT_SOURCE = 'ONBOARDING_V2';

export function formatOnboardingDepositUserNotes(): string {
  return `${ONBOARDING_DEPOSIT_SOURCE}|Versement programmé via nouveau flux onboarding (T4)`;
}

export function isOnboardingDepositUserNotes(userNotes: string | null | undefined): boolean {
  return (userNotes ?? '').startsWith(`${ONBOARDING_DEPOSIT_SOURCE}|`);
}

export async function findOnboardingDepositIntent(
  userId: string,
  options: { awaitingKycApproval: boolean },
) {
  const rows = await db
    .select()
    .from(transactionIntents)
    .where(
      and(
        eq(transactionIntents.userId, userId),
        eq(transactionIntents.intentType, 'DEPOSIT'),
        eq(transactionIntents.accountType, 'SAMA_NAFFA'),
        eq(transactionIntents.status, 'PENDING'),
        eq(transactionIntents.awaitingKycApproval, options.awaitingKycApproval),
        like(transactionIntents.userNotes, `${ONBOARDING_DEPOSIT_SOURCE}|%`),
      )!,
    )
    .orderBy(desc(transactionIntents.createdAt))
    .limit(1);

  return rows[0] ?? null;
}

/**
 * Legacy helper kept for callers. Wave is a direct rail now — do not rewrite
 * brand method ids (orange_money, wave, …) to generic `intouch`.
 */
export async function normalizeLegacyOnboardingPaymentMethod(
  intentId: string,
  paymentMethod: string,
): Promise<string> {
  void intentId;
  return paymentMethod;
}
