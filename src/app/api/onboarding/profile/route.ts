import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { mergeInvestorProfile, readOnboardingProgress } from '@/lib/onboarding-progress';
import { recordSponsorCodeUsage, verifySponsorCode } from '@/lib/sponsor-code';
import { recordAgentCodeUsage, verifyAgentCode } from '@/lib/field-agent';
import { isLegacyCampaignDeprecated } from '@/lib/legacy-campaign-deprecation';

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
    const { firstName, lastName, investorProfile, referralCode, metiers, country, region } =
      await request.json();

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (typeof firstName === 'string' && firstName.trim()) data.firstName = firstName.trim();
    if (typeof lastName === 'string' && lastName.trim()) data.lastName = lastName.trim();
    if (typeof metiers === 'string' && metiers.trim()) data.metiers = metiers.trim();
    if (typeof country === 'string' && country.trim()) data.country = country.trim().toUpperCase();
    if (typeof region === 'string' && region.trim()) data.region = region.trim();

    // Mono-produit Sama Naffa: the referral field is a field-agent code (attribution only).
    const monoProduit = isLegacyCampaignDeprecated();
    let validatedReferralCode: string | null | undefined;

    if (referralCode !== undefined) {
      if (referralCode === null || referralCode === '') {
        validatedReferralCode = null;
        if (monoProduit) data.referredByAgentId = null;
      } else if (typeof referralCode === 'string') {
        const trimmed = referralCode.trim();
        if (!trimmed) {
          validatedReferralCode = null;
          if (monoProduit) data.referredByAgentId = null;
        } else if (monoProduit) {
          const verification = await verifyAgentCode(trimmed);
          if (!verification.valid) {
            return NextResponse.json({ error: verification.error }, { status: 400 });
          }
          validatedReferralCode = verification.code;
          data.referredByAgentId = verification.agentId;
        } else {
          const verification = await verifySponsorCode(trimmed);
          if (!verification.valid) {
            return NextResponse.json({ error: verification.error }, { status: 400 });
          }
          validatedReferralCode = verification.code;
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

    const [updated] = await db
      .update(users)
      .set(data as Partial<typeof users.$inferInsert>)
      .where(eq(users.id, userId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    if (!monoProduit && validatedReferralCode && validatedReferralCode !== prevReferral) {
      await recordSponsorCodeUsage(validatedReferralCode);
    }
    if (monoProduit && validatedReferralCode && validatedReferralCode !== prevReferral) {
      await recordAgentCodeUsage(validatedReferralCode);
    }

    const savedReferral = readOnboardingProgress(updated.investorProfile).referralCode ?? null;

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        referralCode: savedReferral,
        metiers: updated.metiers,
        country: updated.country,
        region: updated.region,
      },
    });
  } catch (error) {
    console.error('[onboarding/profile]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
