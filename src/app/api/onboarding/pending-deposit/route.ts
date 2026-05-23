import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateReferenceNumber } from '@/lib/utils';
import { createUserNotification } from '@/lib/user-notifications';
import {
  findOnboardingDepositIntent,
  normalizeLegacyOnboardingPaymentMethod,
} from '@/lib/onboarding-deposit';

function serializeIntent(intent: {
  id: string;
  accountId: string;
  amount: unknown;
  paymentMethod: string;
  referenceNumber: string;
  status: string;
  createdAt: Date;
}) {
  return {
    id: intent.id,
    accountId: intent.accountId,
    amount: Number(intent.amount),
    paymentMethod: intent.paymentMethod,
    referenceNumber: intent.referenceNumber,
    status: intent.status,
    createdAt: intent.createdAt,
  };
}

/**
 * Returns the onboarding deposit intent awaiting user payment (post-KYC).
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const intent = await findOnboardingDepositIntent(session.user.id, {
      awaitingKycApproval: false,
    });
    if (!intent) {
      return NextResponse.json({ success: true, intent: null });
    }

    const paymentMethod = await normalizeLegacyOnboardingPaymentMethod(
      intent.id,
      intent.paymentMethod,
    );

    return NextResponse.json({
      success: true,
      intent: serializeIntent({ ...intent, paymentMethod }),
    });
  } catch (error) {
    console.error('[onboarding/pending-deposit]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

/** Update the programmed deposit amount before payment. */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { amount } = await request.json();
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < 1000) {
      return NextResponse.json({ error: 'Montant invalide (minimum 1 000 FCFA)' }, { status: 400 });
    }

    const intent = await findOnboardingDepositIntent(session.user.id, {
      awaitingKycApproval: false,
    });
    if (!intent) {
      return NextResponse.json({ error: 'Aucun dépôt programmé à modifier' }, { status: 404 });
    }

    const referenceNumber = generateReferenceNumber(
      'sama_naffa',
      'deposit',
      session.user.id,
      new Date(),
    );

    const updated = await prisma.transactionIntent.update({
      where: { id: intent.id },
      data: {
        amount: numericAmount.toFixed(2),
        referenceNumber,
        adminNotes: 'Montant modifié par l\'utilisateur (onboarding)',
      },
    });

    await createUserNotification(session.user.id, {
      title: 'Dépôt programmé mis à jour',
      message: `Votre premier dépôt a été modifié à ${numericAmount.toLocaleString('fr-FR')} FCFA. Confirmez-le depuis Sama Naffa.`,
      type: 'TRANSACTION',
      priority: 'NORMAL',
      metadata: {
        actionUrl: '/portal/sama-naffa?confirmDeposit=1',
        intentId: updated.id,
        kind: 'onboarding_deposit_updated',
      },
    });

    return NextResponse.json({
      success: true,
      intent: serializeIntent(updated),
    });
  } catch (error) {
    console.error('[onboarding/pending-deposit PATCH]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

/** Cancel the programmed onboarding deposit. */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const intent = await findOnboardingDepositIntent(session.user.id, {
      awaitingKycApproval: false,
    });
    if (!intent) {
      return NextResponse.json({ error: 'Aucun dépôt programmé à annuler' }, { status: 404 });
    }

    await prisma.transactionIntent.update({
      where: { id: intent.id },
      data: {
        status: 'CANCELLED',
        adminNotes: 'Annulé par l\'utilisateur (onboarding)',
      },
    });

    await createUserNotification(session.user.id, {
      title: 'Dépôt programmé annulé',
      message:
        'Votre premier dépôt programmé a été annulé. Vous pouvez effectuer un nouveau dépôt à tout moment depuis Sama Naffa.',
      type: 'TRANSACTION',
      priority: 'NORMAL',
      metadata: {
        actionUrl: '/portal/sama-naffa',
        intentId: intent.id,
        kind: 'onboarding_deposit_cancelled',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[onboarding/pending-deposit DELETE]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
