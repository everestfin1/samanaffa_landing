import { NextRequest, NextResponse } from 'next/server';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { formDrafts } from '@/lib/db/schema';
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth';

const STATUS_VALUES = ['ABANDONED', 'CONTACTED', 'CONVERTED', 'DISMISSED'] as const;

export async function GET(req: NextRequest) {
  const { error, user } = await verifyAdminAuth(req);

  if (error || !user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const drafts = await db
      .select()
      .from(formDrafts)
      .orderBy(desc(formDrafts.lastActivityAt));

    const statsResult = await db
      .select({
        total: sql<number>`count(*)`,
        abandoned: sql<number>`count(*) filter (where ${formDrafts.status} = 'ABANDONED')`,
        contacted: sql<number>`count(*) filter (where ${formDrafts.status} = 'CONTACTED')`,
        converted: sql<number>`count(*) filter (where ${formDrafts.status} = 'CONVERTED')`,
        dismissed: sql<number>`count(*) filter (where ${formDrafts.status} = 'DISMISSED')`,
      })
      .from(formDrafts);

    const stats = {
      total: Number(statsResult[0]?.total || 0),
      abandoned: Number(statsResult[0]?.abandoned || 0),
      contacted: Number(statsResult[0]?.contacted || 0),
      converted: Number(statsResult[0]?.converted || 0),
      dismissed: Number(statsResult[0]?.dismissed || 0),
    };

    return NextResponse.json({ success: true, drafts, stats });
  } catch (err) {
    console.error('Error fetching abandoned leads:', err);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des leads abandonnés' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { error, user } = await verifyAdminAuth(req);

  if (error || !user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const body = await req.json();
    const { id, status, adminNotes } = body as {
      id?: string;
      status?: string;
      adminNotes?: string | null;
    };

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    if (status && !STATUS_VALUES.includes(status as typeof STATUS_VALUES[number])) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
    }

    const statusValue = status as (typeof STATUS_VALUES)[number] | undefined;

    const [updatedDraft] = await db
      .update(formDrafts)
      .set({
        status: statusValue || undefined,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      })
      .where(eq(formDrafts.id, id))
      .returning();

    return NextResponse.json({ success: true, draft: updatedDraft });
  } catch (err) {
    console.error('Error updating abandoned lead:', err);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du lead abandonné' },
      { status: 500 }
    );
  }
}
