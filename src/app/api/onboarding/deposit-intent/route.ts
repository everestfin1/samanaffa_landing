import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateReferenceNumber } from '@/lib/utils';

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
    const { amount, wallet } = await request.json();

    if (!amount || !wallet) {
      return NextResponse.json(
        { error: 'amount et wallet requis' },
        { status: 400 },
      );
    }

    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < 1000) {
      return NextResponse.json({ error: 'Montant invalide (minimum 1 000 FCFA)' }, { status: 400 });
    }

    const allowedWallets = ['intouch', 'orange_money', 'wave', 'free_money'];
    if (!allowedWallets.includes(wallet)) {
      return NextResponse.json({ error: 'Méthode de paiement invalide' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const samaNaffaAccount = user.accounts?.find((a: any) => a.accountType === 'SAMA_NAFFA');
    if (!samaNaffaAccount) {
      return NextResponse.json({ error: 'Compte Sama Naffa introuvable' }, { status: 404 });
    }

    const referenceNumber = generateReferenceNumber('sama_naffa', 'deposit', userId, new Date());

    const intent = await prisma.transactionIntent.create({
      data: {
        userId,
        accountId: samaNaffaAccount.id,
        accountType: 'SAMA_NAFFA',
        intentType: 'DEPOSIT',
        amount: numericAmount.toFixed(2),
        paymentMethod: wallet,
        status: 'PENDING',
        referenceNumber,
        awaitingKycApproval: true,
        userNotes: 'Dépôt programmé via nouveau flux onboarding (T4)',
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
