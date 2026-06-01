import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth';

// GET - List all dashboard cards
export async function GET(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);

  if (error || !user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    let cards = await prisma.dashboardCard.findMany({
      orderBy: { order: 'asc' },
    });

    // Seed defaults if empty
    if (cards.length === 0) {
      const defaults = [
        { title: 'Flux confirmés', type: 'chart', dataSource: 'aum', color: 'default', colSpan: 8, rowSpan: 2, order: 0, icon: 'Wallet', visible: true },
        { title: 'Clients enregistrés', type: 'stat', dataSource: 'totalUsers', color: 'dark', colSpan: 4, rowSpan: 2, order: 1, icon: 'Users', visible: true },
        { title: 'Activité récente', type: 'list', dataSource: 'recentActivity', color: 'default', colSpan: 6, rowSpan: 3, order: 2, icon: 'LayoutDashboard', visible: true },
        { title: 'Vérification KYC', type: 'link', dataSource: 'kycAction', color: 'gradient', colSpan: 6, rowSpan: 2, order: 3, icon: 'ShieldCheck', link: '/admin/kyc', visible: true },
        { title: 'Dépôts confirmés', type: 'stat', dataSource: 'totalDeposits', color: 'default', colSpan: 3, rowSpan: 1, order: 4, icon: 'Wallet', visible: true },
        { title: 'Investissements', type: 'stat', dataSource: 'totalInvestments', color: 'default', colSpan: 3, rowSpan: 1, order: 5, icon: 'TrendingUp', visible: true },
        { title: 'KYC en attente', type: 'stat', dataSource: 'pendingKyc', color: 'default', colSpan: 3, rowSpan: 1, order: 6, icon: 'ShieldCheck', visible: true },
        { title: 'En attente', type: 'stat', dataSource: 'pendingTransactions', color: 'default', colSpan: 3, rowSpan: 1, order: 7, icon: 'Clock', visible: true },
      ];
      for (const d of defaults) {
        await prisma.dashboardCard.create({ data: d as any });
      }
      cards = await prisma.dashboardCard.findMany({ orderBy: { order: 'asc' } });
    }

    return NextResponse.json({
      success: true,
      cards: cards.map((card: any) => ({
        id: card.id,
        title: card.title,
        type: card.type,
        dataSource: card.dataSource,
        color: card.color,
        colSpan: card.colSpan,
        rowSpan: (card as any).rowSpan ?? 1,
        order: card.order,
        icon: card.icon,
        link: card.link,
        visible: card.visible,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
      })),
    });
  } catch (err) {
    console.error('Error fetching dashboard cards:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new dashboard card
export async function POST(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);

  if (error || !user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const body = await request.json();
    const { title, type, dataSource, color, colSpan, rowSpan, order, icon, link, visible } = body;

    if (!title || !type || !dataSource) {
      return NextResponse.json(
        { success: false, error: 'Title, type, and dataSource are required' },
        { status: 400 }
      );
    }

    const card = await prisma.dashboardCard.create({
      data: {
        title,
        type,
        dataSource,
        color: color || 'default',
        colSpan: colSpan || 3,
        rowSpan: rowSpan || 1,
        order: order ?? 0,
        icon: icon || null,
        link: link || null,
        visible: visible !== false,
      },
    });

    console.log('[Admin] Created dashboard card:', {
      id: card.id,
      title: card.title,
      createdBy: user.email,
    });

    return NextResponse.json({
      success: true,
      card,
    });
  } catch (err) {
    console.error('Error creating dashboard card:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a card (or batch update order)
export async function PUT(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);

  if (error || !user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const body = await request.json();

    // Batch reorder
    if (body.cards && Array.isArray(body.cards)) {
      for (const { id, order, colSpan, rowSpan } of body.cards) {
        if (id) {
          await prisma.dashboardCard.update({
            where: { id },
            data: {
              order: order ?? undefined,
              colSpan: colSpan ?? undefined,
              rowSpan: rowSpan ?? undefined,
            },
          });
        }
      }
      return NextResponse.json({ success: true });
    }

    // Single card update
    const { id, title, type, dataSource, color, colSpan, rowSpan, order, icon, link, visible } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Card ID required' },
        { status: 400 }
      );
    }

    const card = await prisma.dashboardCard.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(type !== undefined && { type }),
        ...(dataSource !== undefined && { dataSource }),
        ...(color !== undefined && { color }),
        ...(colSpan !== undefined && { colSpan }),
        ...(rowSpan !== undefined && { rowSpan }),
        ...(order !== undefined && { order }),
        ...(icon !== undefined && { icon }),
        ...(link !== undefined && { link }),
        ...(visible !== undefined && { visible }),
      },
    });

    return NextResponse.json({ success: true, card });
  } catch (err) {
    console.error('Error updating dashboard card:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a dashboard card
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
        { success: false, error: 'Card ID required' },
        { status: 400 }
      );
    }

    await prisma.dashboardCard.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting dashboard card:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
