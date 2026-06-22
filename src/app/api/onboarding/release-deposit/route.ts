import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { updateOnboardingDepositIntentsForKycStatus } from '@/lib/kyc-deposit-intents';
import { findOnboardingDepositIntent } from '@/lib/onboarding-deposit';

/**
 * Idempotently release onboarding deposit intents after KYC approval (ONB-047).
 * Safe to call from T5 before advancing to T6 if webhook/sync is slightly behind.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const userId = session.user.id;
    const [user] = await db
      .select({ kycStatus: users.kycStatus })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    if (user.kycStatus !== 'APPROVED') {
      return NextResponse.json({
        released: false,
        reason: 'kyc_not_approved',
        kycStatus: user.kycStatus,
      });
    }

    await updateOnboardingDepositIntentsForKycStatus(userId, 'APPROVED');

    const intent = await findOnboardingDepositIntent(userId, {
      awaitingKycApproval: false,
    });

    return NextResponse.json({
      released: true,
      intentId: intent?.id ?? null,
    });
  } catch (error) {
    console.error('[onboarding/release-deposit]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
