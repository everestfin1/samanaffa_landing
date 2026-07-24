import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { transactionIntents } from '@/lib/db/schema';
import { findOnboardingDepositIntent } from '@/lib/onboarding-deposit';
import { createWaveCheckout, isWavePaymentsConfigured } from '@/lib/payments/wave-client';
import { getAppBaseUrl } from '@/lib/app-url';

/**
 * Start a direct Wave checkout for the post-KYC onboarding deposit.
 * Returns 503 until WAVE_* credentials are provisioned.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    if (!isWavePaymentsConfigured()) {
      return NextResponse.json(
        {
          error:
            'Paiement Wave direct pas encore disponible. Utilise un autre moyen (via Intouch) pour l’instant.',
          code: 'wave_not_configured',
        },
        { status: 503 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as { amount?: number };
    const intent = await findOnboardingDepositIntent(session.user.id, {
      awaitingKycApproval: false,
    });
    if (!intent) {
      return NextResponse.json({ error: 'Aucun versement programmé' }, { status: 404 });
    }

    const amount =
      typeof body.amount === 'number' && Number.isFinite(body.amount)
        ? body.amount
        : Number(intent.amount);

    if (!Number.isFinite(amount) || amount < 1000) {
      return NextResponse.json({ error: 'Montant invalide (minimum 1 000 FCFA)' }, { status: 400 });
    }

    await db
      .update(transactionIntents)
      .set({
        amount: amount.toFixed(2),
        paymentMethod: 'wave',
        adminNotes: 'Paiement Wave direct (onboarding E6)',
      })
      .where(eq(transactionIntents.id, intent.id));

    const baseUrl = getAppBaseUrl(request);
    const result = await createWaveCheckout({
      amount,
      referenceNumber: intent.referenceNumber,
      successUrl: `${baseUrl}/onboarding?wave=success`,
      errorUrl: `${baseUrl}/onboarding?wave=failed`,
      clientReference: intent.id,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, code: result.code },
        { status: result.code === 'not_configured' ? 503 : 502 },
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: result.checkoutUrl,
      waveSessionId: result.waveSessionId,
    });
  } catch (error) {
    console.error('[onboarding/pay/wave]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
