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

const STEPS: OnboardingStep[] = ['T0', 'T1', 'T2', 'E3', 'T3', 'T4', 'T5', 'E6', 'E8', 'T6'];

function isValidStep(step: string): step is OnboardingStep {
  return STEPS.includes(step as OnboardingStep);
}

const STEP_ORDER: Record<OnboardingStep, number> = {
  T0: 0,
  T1: 1,
  T2: 2,
  E3: 3,
  T3: 4,
  T4: 4,
  T5: 5,
  E6: 6,
  E8: 7,
  T6: 8,
};

const ALLOWED_TRANSITIONS: Partial<Record<OnboardingStep, OnboardingStep[]>> = {
  T1: ['T2'],
  T2: ['E3'],
  E3: ['T4'],
  T3: ['T4'],
  T4: ['T5'],
  T5: ['E6'],
  E6: ['E8'],
  E8: ['T6'],
};

const MAX_STRING_LEN = 500;
const MIN_DEPOSIT = 1_000;

function isValidTransition(
  from: OnboardingStep | null,
  to: OnboardingStep,
): boolean {
  if (!from) return true;
  if (from === to) return true;
  const allowed = ALLOWED_TRANSITIONS[from];
  if (allowed && allowed.includes(to)) return true;
  if (STEP_ORDER[to] > STEP_ORDER[from]) return true;
  return false;
}

function validatePatchBody(body: Partial<OnboardingProgressPayload>): string | null {
  if (body.depositAmount !== undefined && body.depositAmount !== null) {
    if (typeof body.depositAmount !== 'number' || !Number.isFinite(body.depositAmount)) {
      return 'Montant de versement invalide';
    }
    if (body.depositAmount < MIN_DEPOSIT) {
      return `Le versement minimum est de ${MIN_DEPOSIT.toLocaleString('fr-FR')} FCFA`;
    }
  }
  if (body.wallet !== undefined && body.wallet !== null) {
    if (typeof body.wallet !== 'string' || body.wallet.length > MAX_STRING_LEN) {
      return 'Portefeuille invalide';
    }
  }
  if (body.formula !== undefined && body.formula !== null) {
    if (typeof body.formula !== 'string' || body.formula.length > MAX_STRING_LEN) {
      return 'Formule invalide';
    }
  }
  if (body.referralCode !== undefined && body.referralCode !== null) {
    if (typeof body.referralCode !== 'string' || body.referralCode.length > 100) {
      return 'Code de parrainage invalide';
    }
  }
  if (body.firstName !== undefined && body.firstName !== null) {
    if (typeof body.firstName !== 'string' || body.firstName.length > 200) {
      return 'Prénom invalide';
    }
  }
  return null;
}

const progressSelect = {
  id: users.id,
  firstName: users.firstName,
  investorProfile: users.investorProfile,
  kycStatus: users.kycStatus,
  termsAccepted: users.termsAccepted,
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

    const validationError = validatePatchBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const [user] = await db
      .select({
        investorProfile: users.investorProfile,
        firstName: users.firstName,
        kycStatus: users.kycStatus,
        termsAccepted: users.termsAccepted,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const currentProgress = readOnboardingProgress(user.investorProfile);
    const currentStep = currentProgress.step ?? null;

    if (!isValidTransition(currentStep, body.step)) {
      return NextResponse.json(
        { error: `Transition invalide: ${currentStep ?? '—'} → ${body.step}` },
        { status: 403 },
      );
    }

    if ((body.step === 'E8' || body.step === 'T6') && user.kycStatus !== 'APPROVED') {
      return NextResponse.json(
        { error: 'La vérification d\'identité doit être approuvée avant de continuer' },
        { status: 403 },
      );
    }

    if (body.step === 'T6') {
      if (!user.termsAccepted) {
        return NextResponse.json(
          { error: 'Le mandat (CGSM) doit être accepté avant de finaliser' },
          { status: 403 },
        );
      }
      const effectiveDeposit = body.depositAmount ?? currentProgress.depositAmount;
      const effectiveFormula = body.formula ?? currentProgress.formula;
      if (effectiveDeposit == null || effectiveDeposit < MIN_DEPOSIT) {
        return NextResponse.json(
          { error: 'Un versement valide est requis pour finaliser' },
          { status: 403 },
        );
      }
      if (!effectiveFormula) {
        return NextResponse.json(
          { error: 'Une formule est requise pour finaliser' },
          { status: 403 },
        );
      }
    }

    if (body.step === 'E6' || body.step === 'E8') {
      const effectiveDeposit = body.depositAmount ?? currentProgress.depositAmount;
      if (effectiveDeposit == null || effectiveDeposit < MIN_DEPOSIT) {
        return NextResponse.json(
          { error: 'Un versement valide est requis à cette étape' },
          { status: 403 },
        );
      }
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
