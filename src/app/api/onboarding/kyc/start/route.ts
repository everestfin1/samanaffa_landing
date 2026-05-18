import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const DIDIT_BASE = 'https://verification.didit.me/v3';

export async function POST(request: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const userId = authSession.user.id;
    const { firstName } = await request.json();

    const apiKey = process.env.DIDIT_API_KEY;
    const workflowId = process.env.DIDIT_WORKFLOW_ID;

    if (!apiKey || !workflowId) {
      console.error('[kyc/start] DIDIT_API_KEY or DIDIT_WORKFLOW_ID not configured');
      return NextResponse.json({ error: 'Service de vérification non configuré' }, { status: 503 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const callbackUrl = `${appUrl}/onboarding/kyc-callback`;

    const userEmail =
      user.email && !user.email.includes('@onboarding.samanaffa.tmp') ? user.email : undefined;

    const diditRes = await fetch(`${DIDIT_BASE}/session/`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        vendor_data: userId,
        callback: callbackUrl,
        language: 'fr',
        ...(userEmail && {
          contact_details: { email: userEmail },
        }),
        ...(firstName && {
          expected_details: { first_name: firstName },
        }),
      }),
    });

    if (!diditRes.ok) {
      const errBody = await diditRes.json().catch(() => ({}));
      console.error('[kyc/start] Didit error:', diditRes.status, errBody);
      return NextResponse.json(
        { error: 'Impossible de créer la session de vérification' },
        { status: 502 },
      );
    }

    const session = await diditRes.json();

    await prisma.kycDocument.create({
      data: {
        userId,
        documentType: 'didit_kyc_session',
        fileName: `Didit KYC – ${session.session_id}`,
        fileUrl: session.session_id,
        verificationStatus: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.session_id,
      verificationUrl: session.url,
    });
  } catch (error) {
    console.error('[onboarding/kyc/start]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
