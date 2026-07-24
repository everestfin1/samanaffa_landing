import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import {
  mergeInvestorProfile,
  readOnboardingProgress,
  type OnboardingProgressPayload,
  type OnboardingStep,
} from '@/lib/onboarding-progress';

const STEPS: OnboardingStep[] = ['T0', 'T1', 'T2', 'E3', 'T3', 'T4', 'T5', 'E6', 'T6'];

function isValidStep(step: string): step is OnboardingStep {
  return STEPS.includes(step as OnboardingStep);
}

const progressSelect = {
  id: users.id,
  firstName: users.firstName,
  investorProfile: users.investorProfile,
  kycStatus: users.kycStatus,
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const [user] = await db
      .select(progressSelect)
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const saved = readOnboardingProgress(user.investorProfile);

    return NextResponse.json({
      success: true,
      progress: {
        step: saved.step ?? 'T2',
        simulation: saved.simulation ?? null,
        firstName: saved.firstName ?? user.firstName,
        referralCode: saved.referralCode ?? null,
        formula: saved.formula ?? null,
        depositAmount: saved.depositAmount ?? null,
        wallet: saved.wallet ?? null,
        kycApproved: user.kycStatus === 'APPROVED',
      },
    });
  } catch (error) {
    console.error('[onboarding/progress GET]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = (await request.json()) as Partial<OnboardingProgressPayload>;
    if (!body.step || !isValidStep(body.step)) {
      return NextResponse.json({ error: 'Étape invalide' }, { status: 400 });
    }

    const [user] = await db
      .select({
        investorProfile: users.investorProfile,
        firstName: users.firstName,
        kycStatus: users.kycStatus,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    if (body.step === 'T6' && user.kycStatus !== 'APPROVED') {
      return NextResponse.json(
        { error: 'La vérification d\'identité doit être approuvée avant de continuer' },
        { status: 403 },
      );
    }

    const onboardingPatch: Partial<OnboardingProgressPayload> = { step: body.step };
    if (body.simulation !== undefined) onboardingPatch.simulation = body.simulation;
    if (body.firstName !== undefined) onboardingPatch.firstName = body.firstName;
    if (body.referralCode !== undefined) onboardingPatch.referralCode = body.referralCode;
    if (body.formula !== undefined) onboardingPatch.formula = body.formula;
    if (body.depositAmount !== undefined) onboardingPatch.depositAmount = body.depositAmount;
    if (body.wallet !== undefined) onboardingPatch.wallet = body.wallet;

    const investorProfile = mergeInvestorProfile(user.investorProfile, {
      onboarding: onboardingPatch,
      ...(body.simulation !== undefined ? { simulation: body.simulation } : {}),
    });

    const updateData: { investorProfile: Record<string, unknown>; firstName?: string } = {
      investorProfile,
    };
    if (typeof body.firstName === 'string' && body.firstName.trim()) {
      updateData.firstName = body.firstName.trim();
    }

    await db.update(users).set(updateData).where(eq(users.id, session.user.id));

    const [refreshed] = await db
      .select({
        firstName: users.firstName,
        investorProfile: users.investorProfile,
        kycStatus: users.kycStatus,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!refreshed) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const progress = readOnboardingProgress(refreshed.investorProfile);

    return NextResponse.json({
      success: true,
      progress: {
        step: progress.step ?? body.step,
        simulation: progress.simulation ?? null,
        firstName: progress.firstName ?? refreshed.firstName,
        referralCode: progress.referralCode ?? null,
        formula: progress.formula ?? null,
        depositAmount: progress.depositAmount ?? null,
        wallet: progress.wallet ?? null,
        kycApproved: refreshed.kycStatus === 'APPROVED',
      },
    });
  } catch (error) {
    console.error('[onboarding/progress PATCH]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
