import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { and, desc, eq } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { kycDocuments, users } from '@/lib/db/schema';
import { getAppBaseUrl } from '@/lib/app-url';
import {
  applyDiditKycBypassApproval,
  isDiditKycBypassEnabled,
} from '@/lib/didit-kyc-bypass';

const DIDIT_BASE = 'https://verification.didit.me/v3';

export async function POST(request: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const userId = authSession.user.id;
    const { firstName, forceFresh } = await request.json();

    if (isDiditKycBypassEnabled()) {
      const sessionId = await applyDiditKycBypassApproval(userId);
      return NextResponse.json({
        success: true,
        bypass: true,
        sessionId,
        verificationUrl: null,
      });
    }

    const apiKey = process.env.DIDIT_API_KEY;
    const workflowId = process.env.DIDIT_WORKFLOW_ID;

    if (!apiKey || !workflowId) {
      console.error('[kyc/start] DIDIT_API_KEY or DIDIT_WORKFLOW_ID not configured');
      return NextResponse.json({ error: 'Service de vérification non configuré' }, { status: 503 });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const [existingDoc] = await db
      .select()
      .from(kycDocuments)
      .where(
        and(
          eq(kycDocuments.userId, userId),
          eq(kycDocuments.documentType, 'didit_kyc_session'),
          eq(kycDocuments.verificationStatus, 'PENDING'),
        ),
      )
      .orderBy(desc(kycDocuments.uploadDate))
      .limit(1);

    if (existingDoc?.fileUrl && !forceFresh) {
      const reuseRes = await fetch(`${DIDIT_BASE}/session/${existingDoc.fileUrl}/`, {
        headers: { 'x-api-key': apiKey },
      });
      if (reuseRes.ok) {
        const reused = await reuseRes.json();
        const terminal = ['Approved', 'Declined', 'Expired', 'Abandoned'];
        if (reused.url && reused.status && !terminal.includes(reused.status)) {
          return NextResponse.json({
            success: true,
            sessionId: existingDoc.fileUrl,
            verificationUrl: reused.url,
            reused: true,
          });
        }
      }
    }

    if (existingDoc?.id && forceFresh) {
      await db
        .update(kycDocuments)
        .set({ verificationStatus: 'REJECTED' })
        .where(eq(kycDocuments.id, existingDoc.id))
        .catch((err) => console.warn('[kyc/start] could not abandon old doc:', err));

      if (existingDoc.fileUrl) {
        await fetch(`${DIDIT_BASE}/session/${existingDoc.fileUrl}/update-status/`, {
          method: 'PATCH',
          headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ new_status: 'Abandoned', comment: 'User retried KYC' }),
        }).catch(() => {});
      }
    }

    const appUrl = getAppBaseUrl(request);
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
        callback_method: 'both',
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

    await db.insert(kycDocuments).values({
      userId,
      documentType: 'didit_kyc_session',
      fileName: `Didit KYC – ${session.session_id}`,
      fileUrl: session.session_id,
      verificationStatus: 'PENDING',
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
