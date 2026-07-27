import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { and, asc, eq } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { userAccounts } from '@/lib/db/schema';
import {
  NATTUKAAY_AMOUNT_MAX,
  NATTUKAAY_AMOUNT_MIN,
  NATTUKAAY_DUREE_MAX,
  NATTUKAAY_DUREE_MIN,
  NATTUKAAY_PROJECTS,
} from '@/components/data/nattukaay-projects';
import {
  buildNaffaAccountPayload,
  getObjectiveBySlug,
  validateCustomNaffaName,
  type NaffaPlanInput,
} from '@/lib/naffa-plan';
import { addMonths } from '@/lib/utils';

/**
 * Applies the E3 “Créer Kondanné” plan onto the user’s first SAMA_NAFFA account.
 * Replaces the legacy quiz → apply-formula path that stamped “Naffa Sérénité”
 * and ignored name / mensualité / durée.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
    const kondanneName =
      typeof body.kondanneName === 'string' ? body.kondanneName : '';
    const monthlyAmount = Number(body.monthlyAmount);
    const durationMonths = Number(body.durationMonths);
    const project =
      typeof body.project === 'string' ? body.project.trim().toLowerCase() : '';

    const nameError = validateCustomNaffaName(kondanneName);
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 });
    }

    if (
      !Number.isFinite(monthlyAmount) ||
      monthlyAmount < NATTUKAAY_AMOUNT_MIN ||
      monthlyAmount > NATTUKAAY_AMOUNT_MAX
    ) {
      return NextResponse.json(
        {
          error: `Le montant mensuel doit être entre ${NATTUKAAY_AMOUNT_MIN.toLocaleString('fr-FR')} et ${NATTUKAAY_AMOUNT_MAX.toLocaleString('fr-FR')} FCFA`,
        },
        { status: 400 },
      );
    }

    if (
      !Number.isFinite(durationMonths) ||
      durationMonths < NATTUKAAY_DUREE_MIN ||
      durationMonths > NATTUKAAY_DUREE_MAX
    ) {
      return NextResponse.json(
        {
          error: `La durée doit être entre ${NATTUKAAY_DUREE_MIN} et ${NATTUKAAY_DUREE_MAX} mois`,
        },
        { status: 400 },
      );
    }

    const nattukaay =
      NATTUKAAY_PROJECTS.find((p) => p.slug === project) ??
      NATTUKAAY_PROJECTS.find((p) => p.slug === 'autres');
    if (!nattukaay) {
      return NextResponse.json({ error: 'Projet invalide' }, { status: 400 });
    }

    const objective = getObjectiveBySlug(nattukaay.slug) ?? getObjectiveBySlug('autres');
    if (!objective) {
      return NextResponse.json({ error: 'Objectif introuvable' }, { status: 400 });
    }

    const plan: NaffaPlanInput = {
      objectiveSlug: objective.slug,
      objectiveId: objective.id,
      objectiveName: objective.name,
      objectiveTitre: objective.titre,
      monthlyAmount,
      durationMonths,
      customName: kondanneName.trim(),
    };
    const payload = buildNaffaAccountPayload(plan);

    const [account] = await db
      .select()
      .from(userAccounts)
      .where(
        and(
          eq(userAccounts.userId, session.user.id),
          eq(userAccounts.accountType, 'SAMA_NAFFA'),
        ),
      )
      .orderBy(asc(userAccounts.createdAt))
      .limit(1);

    if (!account) {
      return NextResponse.json({ error: 'Compte Sama Naffa introuvable' }, { status: 404 });
    }

    const lockedUntil =
      payload.lockPeriodMonths && payload.lockPeriodMonths > 0
        ? addMonths(new Date(account.createdAt), payload.lockPeriodMonths)
        : null;

    const existingMeta =
      account.metadata && typeof account.metadata === 'object' && !Array.isArray(account.metadata)
        ? (account.metadata as Record<string, unknown>)
        : {};

    await db
      .update(userAccounts)
      .set({
        productCode: payload.productCode,
        productName: payload.productName,
        interestRate: payload.interestRate.toFixed(2),
        lockPeriodMonths: payload.lockPeriodMonths,
        lockedUntil,
        allowAdditionalDeposits: payload.allowAdditionalDeposits,
        metadata: {
          ...existingMeta,
          ...payload.metadata,
          kondanneName: kondanneName.trim(),
        },
      })
      .where(eq(userAccounts.id, account.id));

    return NextResponse.json({
      success: true,
      accountId: account.id,
      productName: payload.productName,
    });
  } catch (error) {
    console.error('[onboarding/apply-kondanne]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
