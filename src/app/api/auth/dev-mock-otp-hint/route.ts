import { NextRequest, NextResponse } from 'next/server'
import { and, desc, eq, gt, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { otpCodes, users } from '@/lib/db/schema'
import { isMockOtpEnabled } from '@/lib/mock-otp'
import { canRevealMockOtp } from '@/lib/mock-otp-hint'
import { normalizeInternationalPhone, generatePhoneFormats } from '@/lib/utils'

/**
 * Dev/preview only: return mock OTP after the same client requested send-otp (AUTH-020).
 * Never exposed in production send-otp JSON.
 */
export async function POST(request: NextRequest) {
  if (!isMockOtpEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const { phone, sessionId } = await request.json()

    if (sessionId) {
      if (!canRevealMockOtp(request, `session:${sessionId}`)) {
        return NextResponse.json({ error: 'Code non disponible' }, { status: 403 })
      }
      const [mockOtp] = await db
        .select()
        .from(otpCodes)
        .where(
          and(
            eq(otpCodes.registrationSessionId, sessionId),
            eq(otpCodes.used, false),
            gt(otpCodes.expiresAt, new Date()),
          ),
        )
        .orderBy(desc(otpCodes.createdAt))
        .limit(1)
      if (!mockOtp?.code) {
        return NextResponse.json({ error: 'Aucun code actif' }, { status: 404 })
      }
      return NextResponse.json({ mockOtp: mockOtp.code, mockMode: true })
    }

    const normalizedPhone = normalizeInternationalPhone(phone || '')
    if (!normalizedPhone) {
      return NextResponse.json({ error: 'Numéro invalide' }, { status: 400 })
    }

    if (!canRevealMockOtp(request, normalizedPhone)) {
      return NextResponse.json({ error: 'Code non disponible' }, { status: 403 })
    }

    const formats = generatePhoneFormats(normalizedPhone)
    const [user] =
      formats.length > 0
        ? await db
            .select()
            .from(users)
            .where(inArray(users.phone, formats))
            .limit(1)
        : []

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    const [latestOtp] = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.userId, user.id),
          eq(otpCodes.used, false),
          gt(otpCodes.expiresAt, new Date()),
        ),
      )
      .orderBy(desc(otpCodes.createdAt))
      .limit(1)

    if (!latestOtp?.code) {
      return NextResponse.json({ error: 'Aucun code actif' }, { status: 404 })
    }

    return NextResponse.json({ mockOtp: latestOtp.code, mockMode: true })
  } catch (error) {
    console.error('[dev-mock-otp-hint]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
