import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isMockOtpEnabled } from '@/lib/mock-otp';
import { canRevealMockOtp } from '@/lib/mock-otp-hint';
import { normalizeInternationalPhone, generatePhoneFormats } from '@/lib/utils';
import type { User } from '@/lib/db/schema';

/**
 * Dev/preview only: return mock OTP after the same client requested send-otp (AUTH-020).
 * Never exposed in production send-otp JSON.
 */
export async function POST(request: NextRequest) {
  if (!isMockOtpEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { phone, sessionId } = await request.json();

    if (sessionId) {
      if (!canRevealMockOtp(request, `session:${sessionId}`)) {
        return NextResponse.json({ error: 'Code non disponible' }, { status: 403 });
      }
      const mockOtp = await prisma.otpCode.findFirst({
        where: {
          registrationSessionId: sessionId,
          used: false,
          expiresAt: { gt: new Date() },
        },
      });
      if (!mockOtp?.code) {
        return NextResponse.json({ error: 'Aucun code actif' }, { status: 404 });
      }
      return NextResponse.json({ mockOtp: mockOtp.code, mockMode: true });
    }

    const normalizedPhone = normalizeInternationalPhone(phone || '');
    if (!normalizedPhone) {
      return NextResponse.json({ error: 'Numéro invalide' }, { status: 400 });
    }

    if (!canRevealMockOtp(request, normalizedPhone)) {
      return NextResponse.json({ error: 'Code non disponible' }, { status: 403 });
    }

    let user: User | null = null;
    for (const fmt of generatePhoneFormats(normalizedPhone)) {
      user = await prisma.user.findFirst({ where: { phone: fmt } });
      if (user) break;
    }

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const latestOtp = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!latestOtp?.code) {
      return NextResponse.json({ error: 'Aucun code actif' }, { status: 404 });
    }

    return NextResponse.json({ mockOtp: latestOtp.code, mockMode: true });
  } catch (error) {
    console.error('[dev-mock-otp-hint]', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
