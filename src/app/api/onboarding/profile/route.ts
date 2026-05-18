import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Onboarding T2/T3 — progressively enrich the authenticated user's record.
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const userId = session.user.id;
    const { firstName, lastName, investorProfile } = await request.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (typeof firstName === 'string' && firstName.trim()) data.firstName = firstName.trim();
    if (typeof lastName === 'string' && lastName.trim()) data.lastName = lastName.trim();
    if (investorProfile && typeof investorProfile === 'object') {
      const existing =
        user.investorProfile && typeof user.investorProfile === 'object'
          ? (user.investorProfile as Record<string, unknown>)
          : {};
      data.investorProfile = { ...existing, ...(investorProfile as Record<string, unknown>) };
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Aucune donnée à mettre à jour' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
      },
    });
  } catch (error) {
    console.error('[onboarding/profile]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
