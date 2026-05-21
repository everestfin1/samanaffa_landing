import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBypassKycSessionId, isDiditKycBypassEnabled } from '@/lib/didit-kyc-bypass';
import { prisma } from '@/lib/prisma';

const DIDIT_BASE = 'https://verification.didit.me/v3';
const TERMINAL_STATUSES = ['Approved', 'Declined', 'Expired', 'Abandoned'];

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const userId = session.user.id;
  const sessionId = new URL(request.url).searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId requis' }, { status: 400 });
  }

  const kycDocs = await prisma.kycDocument.findMany({
    where: {
      userId,
      documentType: 'didit_kyc_session',
      fileUrl: sessionId,
    },
    take: 1,
  });

  if (!kycDocs[0]) {
    return NextResponse.json({ error: 'Session KYC introuvable' }, { status: 403 });
  }

  if (isDiditKycBypassEnabled() && isBypassKycSessionId(sessionId)) {
    return NextResponse.json({
      sessionId,
      verificationUrl: null,
      bypass: true,
      diditStatus: 'Approved',
    });
  }

  const apiKey = process.env.DIDIT_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Service de vérification non configuré' }, { status: 503 });
  }

  try {
    const res = await fetch(`${DIDIT_BASE}/session/${sessionId}/`, {
      headers: { 'x-api-key': apiKey },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: res.status });
    }

    const data = await res.json();
    if (!data.url || (data.status && TERMINAL_STATUSES.includes(data.status))) {
      return NextResponse.json({ error: 'Session non réutilisable' }, { status: 410 });
    }

    return NextResponse.json({
      sessionId,
      verificationUrl: data.url,
      diditStatus: data.status,
    });
  } catch (error) {
    console.error('[onboarding/kyc/session-url]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
