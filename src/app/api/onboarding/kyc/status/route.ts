import { NextRequest, NextResponse } from 'next/server';

const DIDIT_BASE = 'https://verification.didit.me/v3';

const DIDIT_TO_INTERNAL: Record<string, string> = {
  'Not Started': 'not_started',
  'In Progress': 'in_progress',
  'Approved':    'approved',
  'Declined':    'declined',
  'In Review':   'in_review',
  'Abandoned':   'abandoned',
  'Expired':     'expired',
  'Resubmitted': 'in_progress',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId requis' }, { status: 400 });
  }

  const apiKey = process.env.DIDIT_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Service de vérification non configuré' }, { status: 503 });
  }

  try {
    const res = await fetch(`${DIDIT_BASE}/session/${sessionId}/decision/`, {
      headers: { 'x-api-key': apiKey },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({
      status: DIDIT_TO_INTERNAL[data.status] ?? 'unknown',
      diditStatus: data.status,
    });
  } catch (error) {
    console.error('[onboarding/kyc/status]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
