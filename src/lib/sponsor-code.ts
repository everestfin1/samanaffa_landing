import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { apeSponsorCodes } from '@/lib/db/schema';
import { normalizeSponsorCode } from '@/lib/sponsor-code-utils';

export { normalizeSponsorCode };

export type SponsorCodeVerificationResult =
  | { valid: true; code: string; message: string }
  | { valid: false; error: string };

/** Validates a referral code against `ape_sponsor_codes` (shared by APE + onboarding). */
export async function verifySponsorCode(
  rawCode: string,
): Promise<SponsorCodeVerificationResult> {
  if (!rawCode || typeof rawCode !== 'string' || rawCode.trim().length < 3) {
    return { valid: false, error: 'Code invalide' };
  }

  const normalizedCode = normalizeSponsorCode(rawCode);

  const [sponsorCode] = await db
    .select()
    .from(apeSponsorCodes)
    .where(eq(apeSponsorCodes.code, normalizedCode))
    .limit(1);

  if (!sponsorCode) {
    return { valid: false, error: 'Code de parrainage non reconnu' };
  }

  if (sponsorCode.status !== 'ACTIVE') {
    return {
      valid: false,
      error:
        sponsorCode.status === 'EXPIRED'
          ? 'Ce code de parrainage a expiré'
          : "Ce code de parrainage n'est plus actif",
    };
  }

  if (sponsorCode.expiresAt && new Date(sponsorCode.expiresAt) < new Date()) {
    await db
      .update(apeSponsorCodes)
      .set({ status: 'EXPIRED', updatedAt: new Date() })
      .where(eq(apeSponsorCodes.id, sponsorCode.id));
    return { valid: false, error: 'Ce code de parrainage a expiré' };
  }

  if (sponsorCode.maxUsage !== null && sponsorCode.usageCount >= sponsorCode.maxUsage) {
    return { valid: false, error: "Ce code de parrainage a atteint sa limite d'utilisation" };
  }

  return {
    valid: true,
    code: sponsorCode.code,
    message: 'Code de parrainage valide',
  };
}

/** Increments usage when a validated code is saved on a user profile. */
export async function recordSponsorCodeUsage(code: string): Promise<void> {
  const normalizedCode = normalizeSponsorCode(code);
  const [sponsorCode] = await db
    .select()
    .from(apeSponsorCodes)
    .where(eq(apeSponsorCodes.code, normalizedCode))
    .limit(1);

  if (!sponsorCode || sponsorCode.status !== 'ACTIVE') return;

  await db
    .update(apeSponsorCodes)
    .set({ usageCount: sponsorCode.usageCount + 1, updatedAt: new Date() })
    .where(eq(apeSponsorCodes.id, sponsorCode.id));
}
