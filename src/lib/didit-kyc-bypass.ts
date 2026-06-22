import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { kycDocuments, users } from '@/lib/db/schema';
import { updateOnboardingDepositIntentsForKycStatus } from '@/lib/kyc-deposit-intents';
import { isPlaceholderFamilyName } from '@/lib/portal-profile-completion';
import type { KycStatus } from '@/lib/types';

/** Prefix for synthetic Didit session ids when bypass is active. */
export const DIDIT_KYC_BYPASS_SESSION_PREFIX = 'dev-bypass-';

/**
 * Dev/test only: skip real Didit verification when DIDIT_KYC_BYPASS=true.
 * Never active in production (NODE_ENV or VERCEL_ENV).
 */
export function isDiditKycBypassEnabled(): boolean {
  if (process.env.NODE_ENV === 'production') return false;
  if (process.env.VERCEL_ENV === 'production') return false;
  const raw = process.env.DIDIT_KYC_BYPASS?.trim().toLowerCase();
  return raw === 'true' || raw === '1' || raw === 'yes';
}

export function isBypassKycSessionId(sessionId: string): boolean {
  return sessionId.startsWith(DIDIT_KYC_BYPASS_SESSION_PREFIX);
}

export function buildBypassKycSessionId(userId: string): string {
  return `${DIDIT_KYC_BYPASS_SESSION_PREFIX}${userId}`;
}

const BYPASS_TEST_IDENTITY = {
  lastName: 'Testeur',
  dateOfBirth: new Date('1990-06-15'),
  address: '12 Avenue Test',
  city: 'Dakar',
  country: 'Sénégal',
  nationality: 'SEN',
  idType: 'Carte nationale',
  idNumber: 'DEV-BYPASS-001',
  placeOfBirth: 'Dakar',
} as const;

/**
 * Marks the user KYC as APPROVED without calling Didit.
 * Fills minimal identity fields when still placeholders (for portal profile flow).
 */
export async function applyDiditKycBypassApproval(userId: string): Promise<string> {
  const sessionId = buildBypassKycSessionId(userId);

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }

  const [existingDoc] = await db
    .select()
    .from(kycDocuments)
    .where(
      and(
        eq(kycDocuments.userId, userId),
        eq(kycDocuments.documentType, 'didit_kyc_session'),
        eq(kycDocuments.fileUrl, sessionId),
      ),
    )
    .limit(1);

  if (!existingDoc) {
    await db.insert(kycDocuments).values({
      userId,
      documentType: 'didit_kyc_session',
      fileName: 'Didit KYC (dev bypass)',
      fileUrl: sessionId,
      verificationStatus: 'APPROVED',
      diditDecisionPayload: {
        bypass: true,
        note: 'DIDIT_KYC_BYPASS — not a real Didit session',
      },
    });
  } else if (existingDoc.verificationStatus !== 'APPROVED') {
    await db
      .update(kycDocuments)
      .set({ verificationStatus: 'APPROVED' })
      .where(eq(kycDocuments.id, existingDoc.id));
  }

  const userPatch: Partial<typeof users.$inferInsert> = {};

  if (user.kycStatus !== 'APPROVED') {
    userPatch.kycStatus = 'APPROVED' as KycStatus;
  }
  if (isPlaceholderFamilyName(user.lastName)) {
    userPatch.lastName = BYPASS_TEST_IDENTITY.lastName;
  }
  if (!user.dateOfBirth) {
    userPatch.dateOfBirth = BYPASS_TEST_IDENTITY.dateOfBirth;
  }
  if (!user.address?.trim()) {
    userPatch.address = BYPASS_TEST_IDENTITY.address;
  }
  if (!user.city?.trim()) {
    userPatch.city = BYPASS_TEST_IDENTITY.city;
  }
  if (!user.country?.trim()) {
    userPatch.country = BYPASS_TEST_IDENTITY.country;
  }
  if (!user.nationality?.trim()) {
    userPatch.nationality = BYPASS_TEST_IDENTITY.nationality;
  }
  if (!user.idType?.trim()) {
    userPatch.idType = BYPASS_TEST_IDENTITY.idType;
  }
  if (!user.idNumber?.trim()) {
    userPatch.idNumber = BYPASS_TEST_IDENTITY.idNumber;
  }
  if (!user.placeOfBirth?.trim()) {
    userPatch.placeOfBirth = BYPASS_TEST_IDENTITY.placeOfBirth;
  }

  if (Object.keys(userPatch).length > 0) {
    await db
      .update(users)
      .set({ ...userPatch, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  if (user.kycStatus !== 'APPROVED') {
    await updateOnboardingDepositIntentsForKycStatus(userId, 'APPROVED');
  }

  console.warn(
    `[didit-kyc-bypass] KYC auto-approved for user ${userId} (session ${sessionId}). Do not use in production.`,
  );

  return sessionId;
}
