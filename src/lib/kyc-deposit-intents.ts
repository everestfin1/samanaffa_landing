import { db } from '@/lib/db';
import { transactionIntents } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

/**
 * Onboarding T4 deposits: release or cancel intents when user KYC status changes.
 * Used by Didit sync (webhook) and admin manual KYC updates (ONB-040).
 */
export async function updateOnboardingDepositIntentsForKycStatus(
  userId: string,
  kycStatus: 'APPROVED' | 'REJECTED',
): Promise<void> {
  if (kycStatus === 'REJECTED') {
    try {
      await db
        .update(transactionIntents)
        .set({
          status: 'CANCELLED',
          awaitingKycApproval: false,
          adminNotes: 'Auto-cancelled: KYC rejected',
        })
        .where(
          and(
            eq(transactionIntents.userId, userId),
            eq(transactionIntents.awaitingKycApproval, true),
          )!,
        );
    } catch (e) {
      console.error('[kyc-deposit-intents] Error cancelling deposit intents:', e);
    }
    return;
  }

  if (kycStatus === 'APPROVED') {
    try {
      await db
        .update(transactionIntents)
        .set({ awaitingKycApproval: false })
        .where(
          and(
            eq(transactionIntents.userId, userId),
            eq(transactionIntents.awaitingKycApproval, true),
          )!,
        );
    } catch (e) {
      console.error('[kyc-deposit-intents] Error releasing deposit intents:', e);
    }
  }
}
