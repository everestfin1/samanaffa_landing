import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { formEvents } from '@/lib/db/schema';

interface IncomingEvent {
  anonymousId?: string;
  formType?: string;
  eventType?: string;
  fieldKey?: string;
  step?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const events = Array.isArray(body?.events) ? (body.events as IncomingEvent[]) : [];

    if (events.length === 0) {
      return NextResponse.json({ error: 'No events provided' }, { status: 400 });
    }

    const now = new Date();
    const rows = events
      .filter((event) => event.anonymousId && event.formType && event.eventType)
      .map((event) => ({
        id: crypto.randomUUID(),
        anonymousId: event.anonymousId as string,
        formType: event.formType as string,
        eventType: event.eventType as string,
        fieldKey: event.fieldKey ?? null,
        step: event.step ?? null,
        metadata: event.metadata ?? null,
        createdAt: event.createdAt ? new Date(event.createdAt) : now,
      }));

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid events payload' }, { status: 400 });
    }

    await db.insert(formEvents).values(rows);

    return NextResponse.json({ success: true, inserted: rows.length });
  } catch (error) {
    console.error('[Telemetry Events] Error:', error);
    return NextResponse.json({ error: 'Failed to ingest telemetry events' }, { status: 500 });
  }
}
