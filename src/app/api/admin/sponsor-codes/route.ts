import { NextRequest, NextResponse } from 'next/server';
import { count, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { adminUsers, apeSponsorCodes } from '@/lib/db/schema';
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth';

// GET - List all sponsor codes
export async function GET(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const whereClause = status
      ? eq(apeSponsorCodes.status, status.toUpperCase() as typeof apeSponsorCodes.status.enumValues[number])
      : undefined;

    const [codes, totalResult, statsResult] = await Promise.all([
      db
        .select({
          id: apeSponsorCodes.id,
          code: apeSponsorCodes.code,
          description: apeSponsorCodes.description,
          status: apeSponsorCodes.status,
          usageCount: apeSponsorCodes.usageCount,
          maxUsage: apeSponsorCodes.maxUsage,
          expiresAt: apeSponsorCodes.expiresAt,
          createdAt: apeSponsorCodes.createdAt,
          updatedAt: apeSponsorCodes.updatedAt,
          createdBy: apeSponsorCodes.createdBy,
          adminId: adminUsers.id,
          adminName: adminUsers.name,
          adminEmail: adminUsers.email,
        })
        .from(apeSponsorCodes)
        .leftJoin(adminUsers, eq(apeSponsorCodes.createdBy, adminUsers.id))
        .where(whereClause)
        .orderBy(desc(apeSponsorCodes.createdAt))
        .limit(limit)
        .offset(skip),
      db
        .select({ total: count() })
        .from(apeSponsorCodes)
        .where(whereClause),
      db
        .select({
          total: sql<number>`count(*)`,
          active: sql<number>`count(*) filter (where ${apeSponsorCodes.status} = 'ACTIVE')`,
          inactive: sql<number>`count(*) filter (where ${apeSponsorCodes.status} = 'INACTIVE')`,
          expired: sql<number>`count(*) filter (where ${apeSponsorCodes.status} = 'EXPIRED')`,
        })
        .from(apeSponsorCodes),
    ]);

    const total = Number(totalResult[0]?.total ?? 0);

    return NextResponse.json({
      success: true,
      codes: codes.map((code) => ({
        id: code.id,
        code: code.code,
        description: code.description,
        status: code.status,
        usageCount: code.usageCount,
        maxUsage: code.maxUsage,
        expiresAt: code.expiresAt,
        createdAt: code.createdAt,
        updatedAt: code.updatedAt,
        createdBy: code.createdBy,
        createdByAdmin: code.adminId ? {
          id: code.adminId,
          name: code.adminName,
          email: code.adminEmail,
        } : null,
      })),
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
  } catch (error) {
    console.error('Error fetching sponsor codes:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new sponsor code
export async function POST(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const body = await request.json();
    const { code, description, maxUsage, expiresAt } = body;

    if (!code || typeof code !== 'string' || code.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Le code doit contenir au moins 3 caractères' },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();

    const [existingCode] = await db
      .select({ id: apeSponsorCodes.id })
      .from(apeSponsorCodes)
      .where(eq(apeSponsorCodes.code, normalizedCode))
      .limit(1);

    if (existingCode) {
      return NextResponse.json(
        { success: false, error: 'Ce code existe déjà' },
        { status: 400 }
      );
    }

    const [sponsorCode] = await db
      .insert(apeSponsorCodes)
      .values({
        code: normalizedCode,
        description: description?.trim() || null,
        createdBy: user.id,
        maxUsage: maxUsage ? parseInt(maxUsage) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        status: 'ACTIVE',
        usageCount: 0,
      })
      .returning();

    console.log('[Admin] Created sponsor code:', {
      id: sponsorCode.id,
      code: sponsorCode.code,
      createdBy: user.email,
    });

    return NextResponse.json({
      success: true,
      sponsorCode: {
        id: sponsorCode.id,
        code: sponsorCode.code,
        description: sponsorCode.description,
        status: sponsorCode.status,
        usageCount: sponsorCode.usageCount,
        maxUsage: sponsorCode.maxUsage,
        expiresAt: sponsorCode.expiresAt,
        createdAt: sponsorCode.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating sponsor code:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création du code' },
      { status: 500 }
    );
  }
}

// PATCH - Update a sponsor code
export async function PATCH(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const body = await request.json();
    const { id, status, description, maxUsage, expiresAt } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID du code requis' },
        { status: 400 }
      );
    }

    const [existingCode] = await db
      .select()
      .from(apeSponsorCodes)
      .where(eq(apeSponsorCodes.id, id))
      .limit(1);

    if (!existingCode) {
      return NextResponse.json(
        { success: false, error: 'Code non trouvé' },
        { status: 404 }
      );
    }

    const updateData: Partial<typeof apeSponsorCodes.$inferInsert> = {
      updatedAt: new Date(),
    };
    
    if (status && ['ACTIVE', 'INACTIVE', 'EXPIRED'].includes(status)) {
      updateData.status = status as typeof apeSponsorCodes.status.enumValues[number];
    }
    
    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }
    
    if (maxUsage !== undefined) {
      updateData.maxUsage = maxUsage ? parseInt(maxUsage) : null;
    }
    
    if (expiresAt !== undefined) {
      updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    const [updatedCode] = await db
      .update(apeSponsorCodes)
      .set(updateData)
      .where(eq(apeSponsorCodes.id, id))
      .returning();

    console.log('[Admin] Updated sponsor code:', {
      id: updatedCode.id,
      code: updatedCode.code,
      updatedBy: user.email,
      changes: updateData,
    });

    return NextResponse.json({
      success: true,
      sponsorCode: {
        id: updatedCode.id,
        code: updatedCode.code,
        description: updatedCode.description,
        status: updatedCode.status,
        usageCount: updatedCode.usageCount,
        maxUsage: updatedCode.maxUsage,
        expiresAt: updatedCode.expiresAt,
        updatedAt: updatedCode.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating sponsor code:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour du code' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a sponsor code
export async function DELETE(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID du code requis' },
        { status: 400 }
      );
    }

    const [existingCode] = await db
      .select()
      .from(apeSponsorCodes)
      .where(eq(apeSponsorCodes.id, id))
      .limit(1);

    if (!existingCode) {
      return NextResponse.json(
        { success: false, error: 'Code non trouvé' },
        { status: 404 }
      );
    }

    await db.delete(apeSponsorCodes).where(eq(apeSponsorCodes.id, id));

    console.log('[Admin] Deleted sponsor code:', {
      id: existingCode.id,
      code: existingCode.code,
      deletedBy: user.email,
    });

    return NextResponse.json({
      success: true,
      message: 'Code supprimé avec succès',
    });
  } catch (error) {
    console.error('Error deleting sponsor code:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du code' },
      { status: 500 }
    );
  }
}
