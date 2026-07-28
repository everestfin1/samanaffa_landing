import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq, gt, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { otpCodes, registrationSessions, userAccounts, users } from '@/lib/db/schema';
import { verifyOTPWithRateLimit, sendRegistrationSessionSmsOtp } from '@/lib/otp';
import { logMockOtp, recordMockOtpSend } from '@/lib/mock-otp-hint';
import {
  normalizeInternationalPhone,
  generateAccountNumber,
  generatePhoneFormats,
  addMonths,
} from '@/lib/utils';
import { checkOTPRateLimitAsync } from '@/lib/rate-limit';
import { isMockOtpEnabled } from '@/lib/mock-otp';
import { mergeInvestorProfile } from '@/lib/onboarding-progress';
import { issuePostSignupToken } from '@/lib/post-signup-token';
import { resolveDefaultOnboardingAccount } from '@/lib/onboarding-default-account';

const PLACEHOLDER_EMAIL_SUFFIX = '@onboarding.samanaffa.tmp';
const MAX_NAME_LEN = 100;

function isUniqueConstraintError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { code?: string };
  return e.code === 'P2002' || e.code === '23505';
}

function isPlaceholderOnboardingEmail(email: string): boolean {
  return email.endsWith(PLACEHOLDER_EMAIL_SUFFIX);
}

function placeholderEmailForPhone(phone: string): string {
  return `${phone.replace(/\+/g, '')}${PLACEHOLDER_EMAIL_SUFFIX}`;
}

function clampName(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim().slice(0, MAX_NAME_LEN);
  return trimmed || fallback;
}

/** Only shown after the caller proves possession of the phone via OTP. */
const EXISTING_ACCOUNT_MESSAGE =
  'Un compte existe déjà pour ce numéro. Connectez-vous pour continuer.';

/**
 * New onboarding flow (T1) — phone OTP account creation.
 *
 * Two-step protocol:
 *   1. action: 'send-otp'    -> creates a registration_session keyed by phone, sends a 6-digit OTP
 *   2. action: 'verify-otp'  -> verifies OTP, creates a real user
 *                                + Sama Naffa + APE accounts
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action,
      phone,
      sessionId,
      otp,
      simulation,
      referralCode,
      email,
      firstName: requestedFirstName,
      lastName: requestedLastName,
    } = body;

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

      // An already-registered phone still gets a session and a real SMS code so
      // this response cannot be used to enumerate customers. The duplicate is
      // only revealed at verify-otp, once the caller proves phone possession.
      let phoneAlreadyRegistered = false;
      const phoneFormats = generatePhoneFormats(normalizedPhone);
      if (phoneFormats.length > 0) {
        const existingRows = await db
          .select()
          .from(users)
          .where(inArray(users.phone, phoneFormats))
          .limit(1);
        const existing = existingRows[0];
        if (existing && !(existing.firstName === 'Temporary' && existing.lastName === 'User')) {
          phoneAlreadyRegistered = true;
        }
      }

      const requestedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
      if (requestedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requestedEmail)) {
        return NextResponse.json({ error: 'Adresse e-mail invalide' }, { status: 400 });
      }

      // The requested address is only ever a request: the session carries a
      // placeholder so nothing here depends on whether the address is already
      // registered, which is what removes the enumeration side channel.
      const sessionEmail = placeholderEmailForPhone(normalizedPhone);
      const pendingEmail: string | null = requestedEmail || null;

      const sessionFirstName = clampName(requestedFirstName, '');
      const sessionLastName = clampName(requestedLastName, '');

      await db
        .delete(registrationSessions)
        .where(eq(registrationSessions.phone, normalizedPhone));

      const [session] = await db
        .insert(registrationSessions)
        .values({
          email: sessionEmail,
          phone: normalizedPhone,
          data: JSON.stringify({
            phone: normalizedPhone,
            email: sessionEmail,
            pendingEmail,
            phoneAlreadyRegistered,
            firstName: sessionFirstName,
            lastName: sessionLastName,
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

      const result = await sendRegistrationSessionSmsOtp(session.id, normalizedPhone);

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
      const pendingEmail =
        typeof sessionData.pendingEmail === 'string' && sessionData.pendingEmail.trim()
          ? sessionData.pendingEmail.trim().toLowerCase()
          : null;
      const firstName = clampName(sessionData.firstName, 'Nouveau');
      const lastName = clampName(sessionData.lastName, 'Membre');

      // The duplicate-phone decision was made at send-otp and deliberately not
      // disclosed there; possession of the code is now proven, so disclose it.
      if (sessionData.phoneAlreadyRegistered === true) {
        await db.delete(registrationSessions).where(eq(registrationSessions.id, sessionId));
        return NextResponse.json({ error: EXISTING_ACCOUNT_MESSAGE }, { status: 409 });
      }

      const defaultAccount = await resolveDefaultOnboardingAccount();

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
          return NextResponse.json({ error: EXISTING_ACCOUNT_MESSAGE }, { status: 409 });
        }
      }

      // Phone OTP proves the phone, never the mailbox: the account always starts
      // on a placeholder address and the requested one stays pending until its
      // confirmation link is opened.
      const accountEmail = placeholderEmailForPhone(phone);
      const unresolvedPendingEmail =
        pendingEmail && !isPlaceholderOnboardingEmail(pendingEmail) ? pendingEmail : null;

      if (temporaryUserId) {
        await db.delete(users).where(eq(users.id, temporaryUserId));
      }

      const sessionSimulation = sessionData.simulation ?? null;
      const investorProfile = mergeInvestorProfile(null, {
        ...(sessionSimulation ? { simulation: sessionSimulation } : {}),
        onboarding: {
          step: 'T2',
          maxStep: 'T2',
          formula: defaultAccount.productName,
          ...(sessionSimulation ? { simulation: sessionSimulation } : {}),
          ...(unresolvedPendingEmail ? { pendingEmail: unresolvedPendingEmail } : {}),
        },
      });

      let newUser;
      try {
        newUser = await db.transaction(async (tx) => {
          const [createdUser] = await tx
            .insert(users)
            .values({
              phone,
              email: accountEmail,
              firstName,
              lastName,
              phoneVerified: true,
              otpVerifiedAt: new Date(),
              preferredLanguage: 'fr',
              investorProfile,
            })
            .returning();

          if (!createdUser) {
            throw new Error('Failed to create user');
          }

          const accountCreatedAt = new Date();
          await tx.insert(userAccounts).values({
            userId: createdUser.id,
            accountType: 'SAMA_NAFFA',
            accountNumber: generateAccountNumber('SN'),
            productCode: defaultAccount.productCode,
            productName: defaultAccount.productName,
            interestRate: defaultAccount.interestRate.toFixed(2),
            lockPeriodMonths: defaultAccount.lockPeriodMonths,
            lockedUntil: addMonths(accountCreatedAt, defaultAccount.lockPeriodMonths),
            allowAdditionalDeposits: defaultAccount.allowAdditionalDeposits,
            createdAt: accountCreatedAt,
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
          return NextResponse.json({ error: EXISTING_ACCOUNT_MESSAGE }, { status: 409 });
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
