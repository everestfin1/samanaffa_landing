import { NextRequest, NextResponse } from 'next/server'
import { and, desc, eq, gt, inArray } from 'drizzle-orm'
import { sendOTP } from '@/lib/otp'
import { db } from '@/lib/db'
import { otpCodes, registrationSessions, users } from '@/lib/db/schema'
import { normalizeInternationalPhone, generatePhoneFormats } from '@/lib/utils'
import { checkOTPRateLimitAsync } from '@/lib/rate-limit'
import { isMockOtpEnabled } from '@/lib/mock-otp'
import { logMockOtp, recordMockOtpSend } from '@/lib/mock-otp-hint'
import { genericOtpSendResponse } from '@/lib/otp-send-response'
import type { User } from '@/lib/db/schema'

async function findUserByEmailOrPhone(
  email?: string,
  normalizedPhone?: string | null,
): Promise<User | null> {
  if (email) {
    const [byEmail] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (byEmail) return byEmail
  }

  if (normalizedPhone) {
    const formats = generatePhoneFormats(normalizedPhone)
    if (formats.length > 0) {
      const [byPhone] = await db
        .select()
        .from(users)
        .where(inArray(users.phone, formats))
        .limit(1)
      if (byPhone) return byPhone
    }
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const { email, phone, type, method, registrationData } = await request.json()

    const identifier = email || phone
    if (identifier) {
      const rateLimit = await checkOTPRateLimitAsync(request, identifier)

      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error: rateLimit.blocked
              ? `Trop de demandes de code OTP. Réessayez dans ${Math.ceil((rateLimit.resetTime - Date.now()) / 60000)} minutes.`
              : 'Trop de demandes de code OTP. Veuillez réessayer plus tard.',
            rateLimit: {
              remaining: rateLimit.remaining,
              resetTime: rateLimit.resetTime,
              blocked: rateLimit.blocked,
            },
          },
          { status: 429 },
        )
      }
    }

    if (type === 'registration' && registrationData) {
      const requiredFields = [
        'firstName',
        'lastName',
        'phone',
        'email',
        'dateOfBirth',
        'nationality',
        'address',
        'city',
        'country',
        'placeOfBirth',
        'statutEmploi',
        'metiers',
        'idType',
        'idNumber',
        'idIssueDate',
        'idExpiryDate',
        'civilite',
        'termsAccepted',
        'privacyAccepted',
        'signature',
      ]

      const missingFields = requiredFields.filter((field) => !registrationData[field])

      if (missingFields.length > 0) {
        return NextResponse.json(
          { error: `Champs requis manquants: ${missingFields.join(', ')}` },
          { status: 400 },
        )
      }

      const sessionExpiry = new Date(Date.now() + 30 * 60 * 1000)

      const normalizedPhone = normalizeInternationalPhone(registrationData.phone || '')
      if (!normalizedPhone) {
        return NextResponse.json(
          { error: 'Format du numéro de téléphone invalide' },
          { status: 400 },
        )
      }

      const [registrationSession] = await db
        .insert(registrationSessions)
        .values({
          email: registrationData.email,
          phone: normalizedPhone,
          data: JSON.stringify({
            ...registrationData,
            phone: normalizedPhone,
            timestamp: new Date().toISOString(),
          }),
          expiresAt: sessionExpiry,
          type: 'REGISTRATION',
        })
        .returning()

      if (!registrationSession) {
        return NextResponse.json(
          { error: 'Erreur lors de la création de la session' },
          { status: 500 },
        )
      }

      const otpResult = await sendOTP(
        registrationData.email,
        normalizedPhone,
        'register',
        method,
        registrationSession.id,
      )

      if (!otpResult.success) {
        await db
          .delete(registrationSessions)
          .where(eq(registrationSessions.id, registrationSession.id))
        return NextResponse.json(
          { error: "Erreur lors de l'envoi du code OTP" },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        sessionId: registrationSession.id,
        message: 'Code OTP envoyé avec succès',
        method: method || 'email',
      })
    }

    if (type === 'login') {
      if (!email && !phone) {
        return NextResponse.json(
          { error: 'Email ou numéro de téléphone requis' },
          { status: 400 },
        )
      }

      const normalizedPhone = phone ? normalizeInternationalPhone(phone) : null
      const user = await findUserByEmailOrPhone(email, normalizedPhone)

      if (!user) {
        return NextResponse.json(
          genericOtpSendResponse(isMockOtpEnabled() ? { devNoAccount: true } : undefined),
        )
      }

      const otpResult = await sendOTP(
        user.email,
        user.phone ?? undefined,
        'login',
        normalizedPhone ? 'sms' : 'email',
      )
      if (!otpResult.success) {
        return NextResponse.json(
          { error: otpResult.message || "Erreur lors de l'envoi du code OTP" },
          { status: 500 },
        )
      }

      const loginResponse: Record<string, unknown> = {
        ...genericOtpSendResponse(),
        method: normalizedPhone ? 'sms' : 'email',
      }

      if (isMockOtpEnabled() && normalizedPhone) {
        loginResponse.mockMode = true
        recordMockOtpSend(request, normalizedPhone)
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
        if (latestOtp?.code) {
          loginResponse.mockOtp = latestOtp.code
          logMockOtp('auth/send-otp login', normalizedPhone, latestOtp.code)
        }
      }

      return NextResponse.json(loginResponse)
    }

    if (type === 'password_reset') {
      return NextResponse.json(
        {
          error:
            "La réinitialisation par mot de passe n'est plus disponible. Connectez-vous avec votre numéro.",
        },
        { status: 410 },
      )
    }

    return NextResponse.json({ error: 'Type de demande non supporté' }, { status: 400 })
  } catch (error) {
    console.error("Erreur lors de l'envoi du code OTP:", error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
