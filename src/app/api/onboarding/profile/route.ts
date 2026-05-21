import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { mergeInvestorProfile, readOnboardingProgress } from '@/lib/onboarding-progress';
import { recordSponsorCodeUsage, verifySponsorCode } from '@/lib/sponsor-code';

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
    const { firstName, lastName, investorProfile, referralCode } = await request.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (typeof firstName === 'string' && firstName.trim()) data.firstName = firstName.trim();
    if (typeof lastName === 'string' && lastName.trim()) data.lastName = lastName.trim();

    let validatedReferralCode: string | null | undefined;

    if (referralCode !== undefined) {
      if (referralCode === null || referralCode === '') {
        validatedReferralCode = null;
      } else if (typeof referralCode === 'string') {
        const trimmed = referralCode.trim();
        if (trimmed) {
          const verification = await verifySponsorCode(trimmed);
          if (!verification.valid) {
            return NextResponse.json({ error: verification.error }, { status: 400 });
          }
          validatedReferralCode = verification.code;
        } else {
          validatedReferralCode = null;
        }
      }
    }

    const prevReferral = readOnboardingProgress(user.investorProfile).referralCode ?? null;

    if (investorProfile && typeof investorProfile === 'object') {
      const existing =
        user.investorProfile && typeof user.investorProfile === 'object'
          ? (user.investorProfile as Record<string, unknown>)
          : {};
      data.investorProfile = { ...existing, ...(investorProfile as Record<string, unknown>) };
    }

    if (validatedReferralCode !== undefined) {
      data.investorProfile = mergeInvestorProfile(data.investorProfile ?? user.investorProfile, {
        onboarding: { referralCode: validatedReferralCode },
      });
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Aucune donnée à mettre à jour' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
    });

    if (validatedReferralCode && validatedReferralCode !== prevReferral) {
      await recordSponsorCodeUsage(validatedReferralCode);
    }

    const savedReferral = readOnboardingProgress(updated.investorProfile).referralCode ?? null;

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        referralCode: savedReferral,
      },
    });
  } catch (error) {
    console.error('[onboarding/profile]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
