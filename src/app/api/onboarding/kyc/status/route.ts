import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { and, eq } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { kycDocuments } from '@/lib/db/schema';
import { syncDiditDecision, DIDIT_STATUS_MAP } from '@/lib/kyc-sync';
import {
  fetchDiditDecision,
  getDiditDeclineMessages,
} from '@/lib/didit-decision';
import {
  applyDiditKycBypassApproval,
  isBypassKycSessionId,
  isDiditKycBypassEnabled,
} from '@/lib/didit-kyc-bypass';

const DIDIT_BASE = 'https://verification.didit.me/v3';

const DIDIT_TO_INTERNAL: Record<string, string> = {
  'Not Started': 'not_started',
  'In Progress': 'in_progress',
  Approved: 'approved',
  Declined: 'declined',
  'In Review': 'in_review',
  Abandoned: 'abandoned',
  Expired: 'expired',
  Resubmitted: 'in_progress',
};

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId requis' }, { status: 400 });
  }

  const [kycDoc] = await db
    .select()
    .from(kycDocuments)
    .where(
      and(
        eq(kycDocuments.userId, userId),
        eq(kycDocuments.documentType, 'didit_kyc_session'),
        eq(kycDocuments.fileUrl, sessionId),
      ),
    )
    .limit(1);

  if (!kycDoc) {
    return NextResponse.json({ error: 'Session KYC introuvable' }, { status: 403 });
  }

  if (isDiditKycBypassEnabled() && isBypassKycSessionId(sessionId)) {
    await applyDiditKycBypassApproval(userId);
    return NextResponse.json({
      status: 'approved',
      diditStatus: 'Approved',
      bypass: true,
    });
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
    const diditStatus: string = data.status;

    if (DIDIT_STATUS_MAP[diditStatus]) {
      try {
        await syncDiditDecision(userId, diditStatus, sessionId);
      } catch (e) {
        console.error('[kyc/status] sync error (non-fatal):', e);
      }
    }

    const internalStatus = DIDIT_TO_INTERNAL[diditStatus] ?? 'unknown';
    let declineReasons: string[] | undefined;

    if (internalStatus === 'declined') {
      const decision = await fetchDiditDecision(sessionId);
      if (decision) {
        declineReasons = getDiditDeclineMessages(decision);
      }
    }

    return NextResponse.json({
      status: internalStatus,
      diditStatus,
      declineReasons,
    });
  } catch (error) {
    console.error('[onboarding/kyc/status]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
