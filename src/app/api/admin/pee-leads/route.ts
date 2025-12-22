import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { peeLeads } from '@/lib/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const { error, user } = await verifyAdminAuth(req);
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {

    // Fetch all PEE leads
    const leads = await db.select().from(peeLeads).orderBy(desc(peeLeads.createdAt));

    // Get stats
    const statsResult = await db
      .select({
        total: sql<number>`count(*)`,
        new: sql<number>`count(*) filter (where ${peeLeads.status} = 'NEW')`,
        contacted: sql<number>`count(*) filter (where ${peeLeads.status} = 'CONTACTED')`,
        converted: sql<number>`count(*) filter (where ${peeLeads.status} = 'CONVERTED')`,
      })
      .from(peeLeads);

    const stats = {
      total: Number(statsResult[0]?.total || 0),
      new: Number(statsResult[0]?.new || 0),
      contacted: Number(statsResult[0]?.contacted || 0),
      converted: Number(statsResult[0]?.converted || 0),
    };

    return NextResponse.json({ success: true, leads, stats });
  } catch (error) {
    console.error('Error fetching PEE leads:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des leads' },
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
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const [updatedLead] = await db
      .update(peeLeads)
      .set({
        status: status || undefined,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      })
      .where(eq(peeLeads.id, id))
      .returning();

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error) {
    console.error('Error updating PEE lead:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du lead' },
      { status: 500 }
    );
  }
}
