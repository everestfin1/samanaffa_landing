import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';

function verifyHealthSecret(request: NextRequest): boolean {
  const expected = process.env.DB_HEALTH_CHECK_SECRET;
  if (!expected) return false;

  const authHeader = request.headers.get('authorization');
  const provided =
    (authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : null) ?? request.headers.get('x-db-health-secret');

  if (!provided) return false;
  if (provided.length !== expected.length) return false;

  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

/**
 * DB connectivity check for deployment debugging (secret-gated).
 * Set DB_HEALTH_CHECK_SECRET, then call with:
 *   Authorization: Bearer <secret>
 * or header x-db-health-secret: <secret>
 */
export async function GET(request: NextRequest) {
  if (!process.env.DB_HEALTH_CHECK_SECRET) {
    return NextResponse.json({ error: 'Health check not configured' }, { status: 503 });
  }
  if (!verifyHealthSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const raw = process.env.DATABASE_URL ?? '';
  const url = raw.replace(/^['"]+|['"]+$/g, '');

  let host = 'missing';
  let database = 'missing';
  try {
    if (url) {
      const parsed = new URL(url);
      host = parsed.hostname;
      database = parsed.pathname.replace(/^\//, '') || 'unknown';
    }
  } catch {
    host = 'invalid-url';
  }

  let hasUsersTable = false;
  let userCount: number | null = null;
  let dbError: string | null = null;

  try {
    const tableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'users'
      ) AS has_users
    `);
    hasUsersTable = Boolean((tableCheck.rows[0] as { has_users?: boolean })?.has_users);

    if (hasUsersTable) {
      const countRes = await db.execute(sql`SELECT COUNT(*)::int AS n FROM users`);
      userCount = Number((countRes.rows[0] as { n?: number })?.n ?? 0);
    }
  } catch (e) {
    dbError = e instanceof Error ? e.message : 'Unknown database error';
  }

  return NextResponse.json({
    vercelEnv: process.env.VERCEL_ENV ?? null,
    host,
    database,
    hasUsersTable,
    userCount,
    dbError,
    // Helps catch copy-paste mistakes in Vercel env (value should NOT include quotes)
    urlHasSurroundingQuotes: raw.length > 0 && /^['"]/.test(raw) && /['"]$/.test(raw),
  });
}
