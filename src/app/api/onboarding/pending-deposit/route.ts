import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Returns the onboarding deposit intent awaiting user payment (post-KYC).
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const userId = session.user.id;

    const intents = await prisma.transactionIntent.findMany({
      where: {
        userId,
        intentType: 'DEPOSIT',
        accountType: 'SAMA_NAFFA',
        status: 'PENDING',
        awaitingKycApproval: false,
        userNotes: { contains: 'onboarding' },
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    const intent = intents[0];

    if (!intent) {
      return NextResponse.json({ success: true, intent: null });
    }

    const amount = Number(intent.amount);

    return NextResponse.json({
      success: true,
      intent: {
        id: intent.id,
        accountId: intent.accountId,
        amount,
        paymentMethod: intent.paymentMethod,
        referenceNumber: intent.referenceNumber,
        status: intent.status,
        createdAt: intent.createdAt,
      },
    });
  } catch (error) {
    console.error('[onboarding/pending-deposit]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
