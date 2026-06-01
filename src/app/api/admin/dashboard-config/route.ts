import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth';
import {
  buildDashboardCardPatch,
  clampColSpan,
  clampRowSpan,
  serializeDashboardCard,
  validateDashboardCardWrite,
} from '@/lib/admin/dashboard-config-validation';

const DEFAULT_CARDS = [
  { title: 'Flux confirmés', type: 'chart', dataSource: 'aum', color: 'default', colSpan: 8, rowSpan: 2, order: 0, icon: 'Wallet', visible: true },
  { title: 'Clients enregistrés', type: 'stat', dataSource: 'totalUsers', color: 'dark', colSpan: 4, rowSpan: 2, order: 1, icon: 'Users', visible: true },
  { title: 'Activité récente', type: 'list', dataSource: 'recentActivity', color: 'default', colSpan: 6, rowSpan: 3, order: 2, icon: 'LayoutDashboard', visible: true },
  { title: 'Vérification KYC', type: 'link', dataSource: 'kycAction', color: 'gradient', colSpan: 6, rowSpan: 2, order: 3, icon: 'ShieldCheck', link: '/admin/kyc', visible: true },
  { title: 'Dépôts confirmés', type: 'stat', dataSource: 'totalDeposits', color: 'default', colSpan: 3, rowSpan: 1, order: 4, icon: 'Wallet', visible: true },
  { title: 'Investissements', type: 'stat', dataSource: 'totalInvestments', color: 'default', colSpan: 3, rowSpan: 1, order: 5, icon: 'TrendingUp', visible: true },
  { title: 'KYC en attente', type: 'stat', dataSource: 'pendingKyc', color: 'default', colSpan: 3, rowSpan: 1, order: 6, icon: 'ShieldCheck', visible: true },
  { title: 'En attente', type: 'stat', dataSource: 'pendingTransactions', color: 'default', colSpan: 3, rowSpan: 1, order: 7, icon: 'Clock', visible: true },
] as const;

async function seedDefaultCardsIfEmpty() {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.dashboardCard.findMany({ orderBy: { order: 'asc' } });
    if (existing.length > 0) return existing;
    for (const d of DEFAULT_CARDS) {
      await tx.dashboardCard.create({ data: { ...d } });
    }
    return tx.dashboardCard.findMany({ orderBy: { order: 'asc' } });
  });
}

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

    if (cards.length === 0) {
      cards = await seedDefaultCardsIfEmpty();
    }

    return NextResponse.json({
      success: true,
      cards: cards.map((card) => serializeDashboardCard(card)),
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
    const validated = validateDashboardCardWrite(body);
    if (!validated.ok) {
      return NextResponse.json({ success: false, error: validated.error }, { status: 400 });
    }

    const { data } = validated;
    const card = await prisma.dashboardCard.create({
      data: {
        title: data.title,
        type: data.type,
        dataSource: data.dataSource,
        color: data.color,
        colSpan: data.colSpan,
        rowSpan: data.rowSpan,
        order: data.order,
        icon: data.icon,
        link: data.link,
        visible: data.visible,
      },
    });

    return NextResponse.json({
      success: true,
      card: serializeDashboardCard(card),
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

    // Batch reorder / layout sync
    if (body.cards && Array.isArray(body.cards)) {
      const updates = body.cards
        .filter((c: { id?: string }) => typeof c?.id === 'string')
        .map((c: { id: string; order?: unknown; colSpan?: unknown; rowSpan?: unknown }) => ({
          id: c.id,
          order: typeof c.order === 'number' && Number.isFinite(c.order) ? Math.round(c.order) : undefined,
          colSpan: c.colSpan !== undefined ? clampColSpan(c.colSpan) : undefined,
          rowSpan: c.rowSpan !== undefined ? clampRowSpan(c.rowSpan) : undefined,
        }));

      await prisma.$transaction(async (tx) => {
        for (const { id, order, colSpan, rowSpan } of updates) {
          await tx.dashboardCard.update({
            where: { id },
            data: {
              ...(order !== undefined && { order }),
              ...(colSpan !== undefined && { colSpan }),
              ...(rowSpan !== undefined && { rowSpan }),
            },
          });
        }
      });

      return NextResponse.json({ success: true });
    }

    const { id } = body;
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Card ID required' },
        { status: 400 }
      );
    }

    const patched = buildDashboardCardPatch(body);
    if (!patched.ok) {
      return NextResponse.json({ success: false, error: patched.error }, { status: 400 });
    }
    if (Object.keys(patched.data).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    const card = await prisma.dashboardCard.update({
      where: { id },
      data: patched.data,
    });

    return NextResponse.json({ success: true, card: serializeDashboardCard(card) });
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
