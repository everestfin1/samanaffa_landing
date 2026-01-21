import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { formDrafts } from '@/lib/db/schema';

interface DraftPayload {
  anonymousId?: string;
  formType?: string;
  draftData?: Record<string, unknown>;
  email?: string | null;
  phone?: string | null;
  stepReached?: string | null;
  fieldsCompleted?: number | null;
  totalFields?: number | null;
  source?: Record<string, unknown> | null;
  deviceInfo?: Record<string, unknown> | null;
}

const computeScore = (payload: DraftPayload) => {
  let score = 0;
  if (payload.email) score += 30;
  if (payload.phone) score += 30;
  if (payload.fieldsCompleted && payload.totalFields) {
    const completionRate = payload.fieldsCompleted / payload.totalFields;
    if (completionRate >= 0.5) score += 15;
  }
  return Math.min(score, 100);
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DraftPayload;
    if (!body?.anonymousId || !body.formType || !body.draftData) {
      return NextResponse.json({ error: 'Invalid draft payload' }, { status: 400 });
    }

    const now = new Date();
    const score = computeScore(body);

    await db
      .insert(formDrafts)
      .values({
        id: crypto.randomUUID(),
        anonymousId: body.anonymousId,
        formType: body.formType,
        draftData: body.draftData,
        email: body.email ?? null,
        phone: body.phone ?? null,
        stepReached: body.stepReached ?? null,
        fieldsCompleted: body.fieldsCompleted ?? null,
        totalFields: body.totalFields ?? null,
        source: body.source ?? null,
        deviceInfo: body.deviceInfo ?? null,
        score,
        status: 'ABANDONED',
        firstSeenAt: now,
        lastActivityAt: now,
      })
      .onConflictDoUpdate({
        target: [formDrafts.anonymousId, formDrafts.formType],
        set: {
          draftData: body.draftData,
          email: body.email ?? null,
          phone: body.phone ?? null,
          stepReached: body.stepReached ?? null,
          fieldsCompleted: body.fieldsCompleted ?? null,
          totalFields: body.totalFields ?? null,
          source: body.source ?? null,
          deviceInfo: body.deviceInfo ?? null,
          score,
          status: 'ABANDONED',
          lastActivityAt: now,
        },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Telemetry Draft] Error:', error);
    return NextResponse.json({ error: 'Failed to persist draft' }, { status: 500 });
  }
}
