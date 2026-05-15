import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Onboarding T2/T3 — progressively enrich the user record created at T1.
 * Mock flow: trust userId from the client (no auth session yet).
 * In production this would be protected by a short-lived onboarding JWT.
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId, firstName, lastName, investorProfile } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (typeof firstName === 'string' && firstName.trim()) data.firstName = firstName.trim();
    if (typeof lastName === 'string' && lastName.trim()) data.lastName = lastName.trim();
    if (investorProfile && typeof investorProfile === 'object') data.investorProfile = investorProfile;

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
