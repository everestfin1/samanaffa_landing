import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { and, eq } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { transactionIntents, userAccounts, users } from '@/lib/db/schema';
import { generateReferenceNumber } from '@/lib/utils';
import { createUserNotification } from '@/lib/user-notifications';
import {
  findOnboardingDepositIntent,
  formatOnboardingDepositUserNotes,
} from '@/lib/onboarding-deposit';

/**
 * Onboarding T4 — program a first deposit BEFORE KYC validation.
 *
 * Per the new flow:
 *   - The deposit is RECORDED as an intent, not charged.
 *   - awaitingKycApproval=true until KYC approval; user pays via Intouch in the portal.
 *     (auto-cancel on KYC rejection — see /api/admin/kyc/[id]/route.ts).
 *   - No Intouch widget is opened here.
 *
 * Now requires authenticated session (userId from session, not client body).
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const userId = session.user.id;
    const { amount, wallet: walletRaw } = await request.json();

    if (!amount) {
      return NextResponse.json({ error: 'amount requis' }, { status: 400 });
    }

    const wallet = walletRaw === 'intouch' || walletRaw == null ? 'intouch' : walletRaw;

    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < 1000) {
      return NextResponse.json({ error: 'Montant invalide (minimum 1 000 FCFA)' }, { status: 400 });
    }

    if (wallet !== 'intouch') {
      return NextResponse.json(
        {
          error:
            'Seul le paiement via Intouch est disponible pour le premier versement. Choisissez Intouch à l’étape précédente.',
        },
        { status: 400 },
      );
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const accounts = await db
      .select()
      .from(userAccounts)
      .where(and(eq(userAccounts.userId, userId), eq(userAccounts.accountType, 'SAMA_NAFFA')));

    const samaNaffaAccount = accounts[0];
    if (!samaNaffaAccount) {
      return NextResponse.json({ error: 'Compte Sama Naffa introuvable' }, { status: 404 });
    }

    const existing = await findOnboardingDepositIntent(userId, { awaitingKycApproval: true });
    if (existing) {
      return NextResponse.json({
        success: true,
        intentId: existing.id,
        referenceNumber: existing.referenceNumber,
        amount: Number(existing.amount),
        wallet: existing.paymentMethod,
        awaitingKycApproval: true,
        reused: true,
      });
    }

    const referenceNumber = generateReferenceNumber('sama_naffa', 'deposit', userId, new Date());

    const [intent] = await db
      .insert(transactionIntents)
      .values({
        userId,
        accountId: samaNaffaAccount.id,
        accountType: 'SAMA_NAFFA',
        intentType: 'DEPOSIT',
        amount: numericAmount.toFixed(2),
        paymentMethod: wallet,
        status: 'PENDING',
        referenceNumber,
        awaitingKycApproval: true,
        userNotes: formatOnboardingDepositUserNotes(),
      })
      .returning();

    if (!intent) {
      return NextResponse.json({ error: 'Erreur lors de la création du versement' }, { status: 500 });
    }

    await createUserNotification(userId, {
      title: 'Premier versement programmé',
      message: `Votre versement de ${numericAmount.toLocaleString('fr-FR')} FCFA sera confirmé via Intouch après validation de votre identité.`,
      type: 'TRANSACTION',
      priority: 'NORMAL',
      metadata: {
        kind: 'onboarding_deposit_scheduled',
        intentId: intent.id,
        actionUrl: '/onboarding',
      },
    });

    return NextResponse.json({
      success: true,
      intentId: intent.id,
      referenceNumber,
      amount: numericAmount,
      wallet,
      awaitingKycApproval: true,
    });
  } catch (error) {
    console.error('[onboarding/deposit-intent]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
