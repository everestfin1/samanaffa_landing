import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  mergeInvestorProfile,
  readOnboardingProgress,
  type OnboardingProgressPayload,
  type OnboardingStep,
} from '@/lib/onboarding-progress';

const STEPS: OnboardingStep[] = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6'];

function isValidStep(step: string): step is OnboardingStep {
  return STEPS.includes(step as OnboardingStep);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, firstName: true, investorProfile: true, kycStatus: true },
    });

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
        formula: saved.formula ?? null,
        depositAmount: saved.depositAmount ?? null,
        wallet: saved.wallet ?? null,
        kycApproved: user.kycStatus === 'APPROVED' || saved.kycApproved === true,
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { investorProfile: true, firstName: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const onboardingPatch: Partial<OnboardingProgressPayload> = { step: body.step };
    if (body.simulation !== undefined) onboardingPatch.simulation = body.simulation;
    if (body.firstName !== undefined) onboardingPatch.firstName = body.firstName;
    if (body.formula !== undefined) onboardingPatch.formula = body.formula;
    if (body.depositAmount !== undefined) onboardingPatch.depositAmount = body.depositAmount;
    if (body.wallet !== undefined) onboardingPatch.wallet = body.wallet;
    if (body.kycApproved !== undefined) onboardingPatch.kycApproved = body.kycApproved;

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

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    const progress = readOnboardingProgress(updated.investorProfile);

    return NextResponse.json({
      success: true,
      progress: {
        step: progress.step ?? body.step,
        simulation: progress.simulation ?? null,
        firstName: progress.firstName ?? updated.firstName,
        formula: progress.formula ?? null,
        depositAmount: progress.depositAmount ?? null,
        wallet: progress.wallet ?? null,
        kycApproved: progress.kycApproved ?? false,
      },
    });
  } catch (error) {
    console.error('[onboarding/progress PATCH]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
