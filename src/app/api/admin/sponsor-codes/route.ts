import { NextRequest, NextResponse } from 'next/server';
import { and, count, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { adminUsers, fieldAgents, transactionIntents, users } from '@/lib/db/schema';
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth';
import { normalizeAgentCode } from '@/lib/field-agent';

type ReferralCodeStatus = typeof fieldAgents.status.enumValues[number];

function serializeCode(
  row: {
    id: string;
    code: string;
    name: string;
    description: string | null;
    phone: string | null;
    email: string | null;
    region: string | null;
    status: ReferralCodeStatus;
    usageCount: number;
    maxUsage: number | null;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string | null;
    adminId: string | null;
    adminName: string | null;
    adminEmail: string | null;
  },
  stats?: { signups: number; kycApproved: number; depositsConfirmed: number; depositsAmount: number },
) {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    phone: row.phone,
    email: row.email,
    region: row.region,
    status: row.status,
    usageCount: row.usageCount,
    maxUsage: row.maxUsage,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    createdBy: row.createdBy,
    createdByAdmin: row.adminId
      ? { id: row.adminId, name: row.adminName, email: row.adminEmail }
      : null,
    stats,
  };
}

/** GET — Sama Naffa referral codes (field_agents) with acquisition stats. */
export async function GET(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);
  if (error || !user) return createErrorResponse('Unauthorized', 401);

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = (page - 1) * limit;

    const statusFilter =
      status && ['ACTIVE', 'INACTIVE', 'EXPIRED'].includes(status.toUpperCase())
        ? eq(fieldAgents.status, status.toUpperCase() as ReferralCodeStatus)
        : undefined;

    const [rows, totalResult, statsResult, signupRows, depositRows] = await Promise.all([
      db
        .select({
          id: fieldAgents.id,
          code: fieldAgents.code,
          name: fieldAgents.name,
          description: fieldAgents.description,
          phone: fieldAgents.phone,
          email: fieldAgents.email,
          region: fieldAgents.region,
          status: fieldAgents.status,
          usageCount: fieldAgents.usageCount,
          maxUsage: fieldAgents.maxUsage,
          expiresAt: fieldAgents.expiresAt,
          createdAt: fieldAgents.createdAt,
          updatedAt: fieldAgents.updatedAt,
          createdBy: fieldAgents.createdBy,
          adminId: adminUsers.id,
          adminName: adminUsers.name,
          adminEmail: adminUsers.email,
        })
        .from(fieldAgents)
        .leftJoin(adminUsers, eq(fieldAgents.createdBy, adminUsers.id))
        .where(statusFilter)
        .orderBy(desc(fieldAgents.createdAt))
        .limit(limit)
        .offset(skip),
      db.select({ total: count() }).from(fieldAgents).where(statusFilter),
      db
        .select({
          total: sql<number>`count(*)`,
          active: sql<number>`count(*) filter (where ${fieldAgents.status} = 'ACTIVE')`,
          inactive: sql<number>`count(*) filter (where ${fieldAgents.status} = 'INACTIVE')`,
          expired: sql<number>`count(*) filter (where ${fieldAgents.status} = 'EXPIRED')`,
        })
        .from(fieldAgents),
      db
        .select({
          agentId: users.referredByAgentId,
          signups: sql<number>`count(*)`,
          kycApproved: sql<number>`count(*) filter (where ${users.kycStatus} = 'APPROVED')`,
        })
        .from(users)
        .where(sql`${users.referredByAgentId} is not null`)
        .groupBy(users.referredByAgentId),
      db
        .select({
          agentId: users.referredByAgentId,
          depositsConfirmed: sql<number>`count(*)`,
          depositsAmount: sql<string>`coalesce(sum(${transactionIntents.amount}), 0)`,
        })
        .from(transactionIntents)
        .innerJoin(users, eq(transactionIntents.userId, users.id))
        .where(
          and(
            sql`${users.referredByAgentId} is not null`,
            eq(transactionIntents.intentType, 'DEPOSIT'),
            eq(transactionIntents.status, 'COMPLETED'),
          ),
        )
        .groupBy(users.referredByAgentId),
    ]);

    const signupMap = new Map(signupRows.map((r) => [r.agentId, r]));
    const depositMap = new Map(depositRows.map((r) => [r.agentId, r]));
    const total = Number(totalResult[0]?.total ?? 0);

    return NextResponse.json({
      success: true,
      codes: rows.map((row) => {
        const s = signupMap.get(row.id);
        const d = depositMap.get(row.id);
        return serializeCode(row, {
          signups: Number(s?.signups ?? 0),
          kycApproved: Number(s?.kycApproved ?? 0),
          depositsConfirmed: Number(d?.depositsConfirmed ?? 0),
          depositsAmount: Number(d?.depositsAmount ?? 0),
        });
      }),
      stats: {
        total: Number(statsResult[0]?.total ?? 0),
        active: Number(statsResult[0]?.active ?? 0),
        inactive: Number(statsResult[0]?.inactive ?? 0),
        expired: Number(statsResult[0]?.expired ?? 0),
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('[Admin] Error listing referral codes:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/** POST — create a referral code. */
export async function POST(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);
  if (error || !user) return createErrorResponse('Unauthorized', 401);

  try {
    const body = await request.json();
    const { code, name, description, phone, email, region, maxUsage, expiresAt } = body;

    if (!code || typeof code !== 'string' || code.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Le code doit contenir au moins 3 caractères' },
        { status: 400 },
      );
    }
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Le nom de l’agent est requis' }, { status: 400 });
    }

    const normalizedCode = normalizeAgentCode(code);

    const [existing] = await db
      .select({ id: fieldAgents.id })
      .from(fieldAgents)
      .where(eq(fieldAgents.code, normalizedCode))
      .limit(1);

    if (existing) {
      return NextResponse.json({ success: false, error: 'Ce code existe déjà' }, { status: 400 });
    }

    const [created] = await db
      .insert(fieldAgents)
      .values({
        code: normalizedCode,
        name: name.trim(),
        description: description?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        region: region?.trim() || null,
        maxUsage: maxUsage ? parseInt(String(maxUsage), 10) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        status: 'ACTIVE',
        usageCount: 0,
        createdBy: user.id,
      })
      .returning();

    return NextResponse.json({ success: true, sponsorCode: created });
  } catch (err) {
    console.error('[Admin] Error creating referral code:', err);
    return NextResponse.json({ success: false, error: 'Erreur lors de la création' }, { status: 500 });
  }
}

/** PATCH — update a referral code. */
export async function PATCH(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);
  if (error || !user) return createErrorResponse('Unauthorized', 401);

  try {
    const body = await request.json();
    const { id, name, description, phone, email, region, status, maxUsage, expiresAt } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requis' }, { status: 400 });
    }

    const [existing] = await db.select().from(fieldAgents).where(eq(fieldAgents.id, id)).limit(1);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Code non trouvé' }, { status: 404 });
    }

    const updateData: Partial<typeof fieldAgents.$inferInsert> = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = String(name).trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (phone !== undefined) updateData.phone = phone?.trim() || null;
    if (email !== undefined) updateData.email = email?.trim() || null;
    if (region !== undefined) updateData.region = region?.trim() || null;
    if (status && ['ACTIVE', 'INACTIVE', 'EXPIRED'].includes(status)) {
      updateData.status = status as ReferralCodeStatus;
    }
    if (maxUsage !== undefined) {
      updateData.maxUsage = maxUsage ? parseInt(String(maxUsage), 10) : null;
    }
    if (expiresAt !== undefined) {
      updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    const [updated] = await db
      .update(fieldAgents)
      .set(updateData)
      .where(eq(fieldAgents.id, id))
      .returning();

    return NextResponse.json({ success: true, sponsorCode: updated });
  } catch (err) {
    console.error('[Admin] Error updating referral code:', err);
    return NextResponse.json({ success: false, error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

/** DELETE — remove a referral code. */
export async function DELETE(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);
  if (error || !user) return createErrorResponse('Unauthorized', 401);

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requis' }, { status: 400 });
    }

    const [existing] = await db.select().from(fieldAgents).where(eq(fieldAgents.id, id)).limit(1);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Code non trouvé' }, { status: 404 });
    }

    await db.delete(fieldAgents).where(eq(fieldAgents.id, id));
    return NextResponse.json({ success: true, message: 'Code supprimé' });
  } catch (err) {
    console.error('[Admin] Error deleting referral code:', err);
    return NextResponse.json({ success: false, error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
