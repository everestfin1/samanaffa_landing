import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyOTPWithRateLimit, sendOTP } from '@/lib/otp';
import { logMockOtp, recordMockOtpSend } from '@/lib/mock-otp-hint';
import { normalizeInternationalPhone, generateAccountNumber, generatePhoneFormats } from '@/lib/utils';
import { getNaffaProductById } from '@/lib/naffa-products';
import { checkOTPRateLimit } from '@/lib/rate-limit';
import { isMockOtpEnabled } from '@/lib/mock-otp';
import { mergeInvestorProfile } from '@/lib/onboarding-progress';
import { issuePostSignupToken } from '@/lib/post-signup-token';
import { genericOtpSendResponse } from '@/lib/otp-send-response';

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

    // ---------------------------------------------------------------------
    // STEP 1: send-otp
    // ---------------------------------------------------------------------
    if (action === 'send-otp') {
      const normalizedPhone = normalizeInternationalPhone(phone || '');
      if (!normalizedPhone) {
        return NextResponse.json({ error: 'Numéro de téléphone invalide' }, { status: 400 });
      }

      const rateLimit = checkOTPRateLimit(request, normalizedPhone);
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: 'Trop de demandes de code OTP. Veuillez réessayer plus tard.' },
          { status: 429 },
        );
      }

      // Check phone not already taken by a real (non-temporary) user
      const phoneFormats = generatePhoneFormats(normalizedPhone);
      for (const fmt of phoneFormats) {
        const existing = await prisma.user.findFirst({ where: { phone: fmt } });
        if (existing && !(existing.firstName === 'Temporary' && existing.lastName === 'User')) {
          return NextResponse.json(genericOtpSendResponse());
        }
      }

      // Placeholder email (mock flow — email collected later in profile)
      const placeholderEmail = `${normalizedPhone.replace(/\+/g, '')}@onboarding.samanaffa.tmp`;

      await prisma.registrationSession.deleteMany({ where: { phone: normalizedPhone } });

      const session = await prisma.registrationSession.create({
        data: {
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
          expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min
        },
      });

      const result = await sendOTP(
        placeholderEmail,
        normalizedPhone,
        'register',
        'sms',
        session.id,
      );

      if (!result.success) {
        await prisma.registrationSession.delete({ where: { id: session.id } });
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
        const mockRow = await prisma.otpCode.findFirst({
          where: {
            registrationSessionId: session.id,
            used: false,
            expiresAt: { gt: new Date() },
          },
        });
        if (mockRow?.code) {
          logMockOtp('onboarding/create-account', session.id, mockRow.code);
        }
      }

      return NextResponse.json(response);
    }

    // ---------------------------------------------------------------------
    // STEP 2: verify-otp -> create account
    // ---------------------------------------------------------------------
    if (action === 'verify-otp') {
      if (!sessionId || !otp) {
        return NextResponse.json({ error: 'Session et code OTP requis' }, { status: 400 });
      }

      const session = await prisma.registrationSession.findUnique({ where: { id: sessionId } });
      if (!session) {
        return NextResponse.json({ error: 'Session invalide ou expirée' }, { status: 404 });
      }
      if (session.expiresAt < new Date()) {
        await prisma.registrationSession.delete({ where: { id: sessionId } });
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

      // Defensive double-check
      const existing = await prisma.user.findFirst({ where: { phone } });
      if (existing && !(existing.firstName === 'Temporary' && existing.lastName === 'User')) {
        await prisma.registrationSession.delete({ where: { id: sessionId } });
        return NextResponse.json({ error: 'Compte déjà existant' }, { status: 409 });
      }

      // Clean up temporary user if any
      if (existing) {
        await prisma.user.delete({ where: { id: existing.id } });
      }

      const simulation = sessionData.simulation ?? null;
      const investorProfile = simulation
        ? mergeInvestorProfile(null, {
            simulation,
            onboarding: { step: 'T2', simulation },
          })
        : mergeInvestorProfile(null, { onboarding: { step: 'T2' } });

      const newUser = await prisma.user.create({
        data: {
          phone,
          email,
          firstName: 'Nouveau',
          lastName: 'Membre',
          phoneVerified: true,
          otpVerifiedAt: new Date(),
          preferredLanguage: 'fr',
          investorProfile,
        },
      });

      // Auto-create Sama Naffa + APE accounts (mirrors existing register flow)
      const defaultProduct = getNaffaProductById('default');
      await prisma.userAccount.create({
        data: {
          userId: newUser.id,
          accountType: 'SAMA_NAFFA',
          accountNumber: generateAccountNumber('SN'),
          productCode: defaultProduct.productCode,
          productName: defaultProduct.name,
          interestRate: defaultProduct.interestRate.toFixed(2),
          lockPeriodMonths: defaultProduct.lockPeriodMonths ?? 0,
          allowAdditionalDeposits: defaultProduct.allowAdditionalDeposits,
        },
      });
      await prisma.userAccount.create({
        data: {
          userId: newUser.id,
          accountType: 'APE_INVESTMENT',
          accountNumber: generateAccountNumber('APE'),
        },
      });

      await prisma.registrationSession.delete({ where: { id: sessionId } });

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
