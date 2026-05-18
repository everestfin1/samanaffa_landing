import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { syncDiditDecision, DIDIT_STATUS_MAP } from '@/lib/kyc-sync';

// ── Signature verification (Didit V2) ──────────────────────────────────────
// HMAC-SHA256 of "{timestamp}:{canonical_json}"
function sortedStringify(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortedStringify);
  if (v !== null && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v as Record<string, unknown>).sort()) {
      out[k] = sortedStringify((v as Record<string, unknown>)[k]);
    }
    return out;
  }
  if (typeof v === 'number' && Number.isFinite(v) && v === Math.trunc(v)) return Math.trunc(v);
  return v;
}

function verifySignatureV2(body: object, signature: string, timestamp: string, secret: string): boolean {
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const canonical = JSON.stringify(sortedStringify(body));
  const message = `${timestamp}:${canonical}`;
  const expected = createHmac('sha256', secret).update(message).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
  } catch {
    return false;
  }
}

// ── Route ──────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Verify HMAC signature if secret is configured
  const secret = process.env.DIDIT_WEBHOOK_SECRET;
  if (secret) {
    const sigV2     = request.headers.get('X-Signature-V2') ?? '';
    const tsHeader  = request.headers.get('X-Timestamp') ?? '';
    if (!sigV2 || !verifySignatureV2(body, sigV2, tsHeader, secret)) {
      console.warn('[webhooks/didit] Invalid signature — rejected');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  } else {
    console.warn('[webhooks/didit] DIDIT_WEBHOOK_SECRET not set — skipping signature check');
  }

  const { session_id, status, vendor_data: userId } = body as {
    session_id?: string;
    status?: string;
    vendor_data?: string;
    webhook_type?: string;
  };

  if (!session_id || !status || !userId || !DIDIT_STATUS_MAP[status]) {
    return NextResponse.json({ received: true });
  }

  try {
    await syncDiditDecision(userId, status, session_id);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[webhooks/didit]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
