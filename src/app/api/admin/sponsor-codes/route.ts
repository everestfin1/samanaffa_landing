import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

    const where = status ? { status: status.toUpperCase() as any } : {};

    const [codes, total] = await Promise.all([
      prisma.apeSponsorCode.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { createdByAdmin: true }
      }),
      prisma.apeSponsorCode.count({ where })
    ]);

    // Calculate stats
    const [totalCodes, activeCodes, inactiveCodes, expiredCodes] = await Promise.all([
      prisma.apeSponsorCode.count(),
      prisma.apeSponsorCode.count({ where: { status: 'ACTIVE' } }),
      prisma.apeSponsorCode.count({ where: { status: 'INACTIVE' } }),
      prisma.apeSponsorCode.count({ where: { status: 'EXPIRED' } }),
    ]);

    return NextResponse.json({
      success: true,
      codes: codes.map(code => ({
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
        createdByAdmin: (code as any).createdByAdmin ? {
          id: (code as any).createdByAdmin.id,
          name: (code as any).createdByAdmin.name,
          email: (code as any).createdByAdmin.email,
        } : null,
      })),
      stats: {
        total: totalCodes,
        active: activeCodes,
        inactive: inactiveCodes,
        expired: expiredCodes,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
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

    // Normalize code to uppercase
    const normalizedCode = code.trim().toUpperCase();

    // Check if code already exists
    const existingCode = await prisma.apeSponsorCode.findUnique({
      where: { code: normalizedCode }
    });

    if (existingCode) {
      return NextResponse.json(
        { success: false, error: 'Ce code existe déjà' },
        { status: 400 }
      );
    }

    // Create the sponsor code
    const sponsorCode = await prisma.apeSponsorCode.create({
      data: {
        code: normalizedCode,
        description: description?.trim() || null,
        createdBy: user.id,
        maxUsage: maxUsage ? parseInt(maxUsage) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        status: 'ACTIVE',
        usageCount: 0,
      }
    });

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
      }
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

    // Check if code exists
    const existingCode = await prisma.apeSponsorCode.findUnique({
      where: { id }
    });

    if (!existingCode) {
      return NextResponse.json(
        { success: false, error: 'Code non trouvé' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Record<string, any> = {};
    
    if (status && ['ACTIVE', 'INACTIVE', 'EXPIRED'].includes(status)) {
      updateData.status = status;
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

    const updatedCode = await prisma.apeSponsorCode.update({
      where: { id },
      data: updateData
    });

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
      }
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

    // Check if code exists
    const existingCode = await prisma.apeSponsorCode.findUnique({
      where: { id }
    });

    if (!existingCode) {
      return NextResponse.json(
        { success: false, error: 'Code non trouvé' },
        { status: 404 }
      );
    }

    await prisma.apeSponsorCode.delete({
      where: { id }
    });

    console.log('[Admin] Deleted sponsor code:', {
      id: existingCode.id,
      code: existingCode.code,
      deletedBy: user.email,
    });

    return NextResponse.json({
      success: true,
      message: 'Code supprimé avec succès'
    });
  } catch (error) {
    console.error('Error deleting sponsor code:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du code' },
      { status: 500 }
    );
  }
}
