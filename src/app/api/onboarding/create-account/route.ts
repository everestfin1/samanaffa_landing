import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq, gt, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { otpCodes, registrationSessions, userAccounts, users } from '@/lib/db/schema';
import { verifyOTPWithRateLimit, sendOTP } from '@/lib/otp';
import { logMockOtp, recordMockOtpSend } from '@/lib/mock-otp-hint';
import {
  normalizeInternationalPhone,
  generateAccountNumber,
  generatePhoneFormats,
} from '@/lib/utils';
import { getNaffaProductById } from '@/lib/naffa-products';
import { checkOTPRateLimitAsync } from '@/lib/rate-limit';
import { isMockOtpEnabled } from '@/lib/mock-otp';
import { mergeInvestorProfile } from '@/lib/onboarding-progress';
import { issuePostSignupToken } from '@/lib/post-signup-token';
import { genericOtpSendResponse } from '@/lib/otp-send-response';

function isUniqueConstraintError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { code?: string };
  return e.code === 'P2002' || e.code === '23505';
}

/**
 * New onboarding flow (T1) — phone-only account creation.
 *
 * Two-step protocol:
 *   1. action: 'send-otp'    -> creates a registration_session keyed by phone, sends a 6-digit OTP
 *   2. action: 'verify-otp'  -> verifies OTP, creates a real user (phone + placeholder email)
 *                                + Sama Naffa + APE accounts
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, phone, sessionId, otp, simulation, referralCode } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action requise' }, { status: 400 });
    }

    if (action === 'send-otp') {
      const normalizedPhone = normalizeInternationalPhone(phone || '');
      if (!normalizedPhone) {
        return NextResponse.json({ error: 'Numéro de téléphone invalide' }, { status: 400 });
      }

      const rateLimit = await checkOTPRateLimitAsync(request, normalizedPhone);
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: 'Trop de demandes de code OTP. Veuillez réessayer plus tard.' },
          { status: 429 },
        );
      }

      const phoneFormats = generatePhoneFormats(normalizedPhone);
      if (phoneFormats.length > 0) {
        const existingRows = await db
          .select()
          .from(users)
          .where(inArray(users.phone, phoneFormats))
          .limit(1);
        const existing = existingRows[0];
        if (existing && !(existing.firstName === 'Temporary' && existing.lastName === 'User')) {
          return NextResponse.json(genericOtpSendResponse());
        }
      }

      const placeholderEmail = `${normalizedPhone.replace(/\+/g, '')}@onboarding.samanaffa.tmp`;

      await db
        .delete(registrationSessions)
        .where(eq(registrationSessions.phone, normalizedPhone));

      const [session] = await db
        .insert(registrationSessions)
        .values({
          email: placeholderEmail,
          phone: normalizedPhone,
          data: JSON.stringify({
            phone: normalizedPhone,
            email: placeholderEmail,
            simulation: simulation || null,
            referralCode:
              typeof referralCode === 'string' && referralCode.trim()
                ? referralCode.trim().toUpperCase()
                : null,
            flow: 'onboarding-v2',
          }),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        })
        .returning();

      if (!session) {
        return NextResponse.json({ error: 'Erreur lors de la création de la session' }, { status: 500 });
      }

      const result = await sendOTP(
        placeholderEmail,
        normalizedPhone,
        'register',
        'sms',
        session.id,
      );

      if (!result.success) {
        await db.delete(registrationSessions).where(eq(registrationSessions.id, session.id));
        return NextResponse.json({ error: result.message }, { status: 400 });
      }

      const response: Record<string, unknown> = {
        success: true,
        sessionId: session.id,
        message: 'Code envoyé par SMS',
      };

      if (isMockOtpEnabled()) {
        response.mockMode = true;
        recordMockOtpSend(request, `session:${session.id}`);
        const [mockRow] = await db
          .select()
          .from(otpCodes)
          .where(
            and(
              eq(otpCodes.registrationSessionId, session.id),
              eq(otpCodes.used, false),
              gt(otpCodes.expiresAt, new Date()),
            ),
          )
          .orderBy(desc(otpCodes.createdAt))
          .limit(1);
        if (mockRow?.code) {
          response.mockOtp = mockRow.code;
          logMockOtp('onboarding/create-account', session.id, mockRow.code);
        }
      }

      return NextResponse.json(response);
    }

    if (action === 'verify-otp') {
      if (!sessionId || !otp) {
        return NextResponse.json({ error: 'Session et code OTP requis' }, { status: 400 });
      }

      const [session] = await db
        .select()
        .from(registrationSessions)
        .where(eq(registrationSessions.id, sessionId))
        .limit(1);

      if (!session) {
        return NextResponse.json({ error: 'Session invalide ou expirée' }, { status: 404 });
      }
      if (session.expiresAt < new Date()) {
        await db.delete(registrationSessions).where(eq(registrationSessions.id, sessionId));
        return NextResponse.json({ error: 'Session expirée' }, { status: 410 });
      }

      const normalizedOtp = String(otp).replace(/\D/g, '').slice(0, 6);
      const verifyResult = await verifyOTPWithRateLimit(request, sessionId, normalizedOtp);
      if (verifyResult.success === false) {
        if (verifyResult.error === 'rate_limited') {
          return NextResponse.json(
            {
              error: verifyResult.blocked
                ? `Trop de tentatives. Réessayez dans ${Math.ceil((verifyResult.resetTime - Date.now()) / 60000)} minutes.`
                : 'Trop de tentatives. Veuillez réessayer plus tard.',
            },
            { status: 429 },
          );
        }
        return NextResponse.json({ error: 'Code OTP invalide ou expiré' }, { status: 400 });
      }

      const sessionData = JSON.parse(session.data);
      const phone: string = sessionData.phone;
      const email: string = sessionData.email;

      const phoneFormats = generatePhoneFormats(phone);
      let temporaryUserId: string | null = null;
      if (phoneFormats.length > 0) {
        const rows = await db
          .select()
          .from(users)
          .where(inArray(users.phone, phoneFormats));
        for (const row of rows) {
          if (row.firstName === 'Temporary' && row.lastName === 'User') {
            temporaryUserId = row.id;
            break;
          }
          await db.delete(registrationSessions).where(eq(registrationSessions.id, sessionId));
          return NextResponse.json({ error: 'Compte déjà existant' }, { status: 409 });
        }
      }
      if (temporaryUserId) {
        await db.delete(users).where(eq(users.id, temporaryUserId));
      }

      const sessionSimulation = sessionData.simulation ?? null;
      const investorProfile = sessionSimulation
        ? mergeInvestorProfile(null, {
            simulation: sessionSimulation,
            onboarding: { step: 'T2', simulation: sessionSimulation },
          })
        : mergeInvestorProfile(null, { onboarding: { step: 'T2' } });

      let newUser;
      try {
        newUser = await db.transaction(async (tx) => {
          const [createdUser] = await tx
            .insert(users)
            .values({
              phone,
              email,
              firstName: 'Nouveau',
              lastName: 'Membre',
              phoneVerified: true,
              otpVerifiedAt: new Date(),
              preferredLanguage: 'fr',
              investorProfile,
            })
            .returning();

          if (!createdUser) {
            throw new Error('Failed to create user');
          }

          const defaultProduct = getNaffaProductById('default');
          await tx.insert(userAccounts).values({
            userId: createdUser.id,
            accountType: 'SAMA_NAFFA',
            accountNumber: generateAccountNumber('SN'),
            productCode: defaultProduct.productCode,
            productName: defaultProduct.name,
            interestRate: defaultProduct.interestRate.toFixed(2),
            lockPeriodMonths: defaultProduct.lockPeriodMonths ?? 0,
            allowAdditionalDeposits: defaultProduct.allowAdditionalDeposits,
          });
          await tx.insert(userAccounts).values({
            userId: createdUser.id,
            accountType: 'APE_INVESTMENT',
            accountNumber: generateAccountNumber('APE'),
          });

          await tx.delete(registrationSessions).where(eq(registrationSessions.id, sessionId));

          return createdUser;
        });
      } catch (err) {
        if (isUniqueConstraintError(err)) {
          await db.delete(registrationSessions).where(eq(registrationSessions.id, sessionId));
          return NextResponse.json({ error: 'Compte déjà existant' }, { status: 409 });
        }
        throw err;
      }

      const sessionToken = await issuePostSignupToken(newUser.id);

      return NextResponse.json({
        success: true,
        userId: newUser.id,
        phone: newUser.phone,
        sessionToken,
      });
    }

    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 });
  } catch (error) {
    console.error('[onboarding/create-account]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
