import { NextRequest, NextResponse } from 'next/server'
import { sendOTP } from '@/lib/otp'
import { sendEmailOTP, sendSMSOTP } from '@/lib/notifications'
import { prisma } from '@/lib/prisma'
import { normalizeInternationalPhone, generatePhoneFormats } from '@/lib/utils'
import { checkOTPRateLimit } from '@/lib/rate-limit'
import { findLegacyAuthUser } from '@/lib/legacy-auth-user'
import type { User } from '@/lib/db/schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = body.email ? body.email.toString().trim().toLowerCase() : undefined
    const phone = body.phone ? body.phone.toString().trim() : undefined
    const type = body.type
    const method = body.method
    const registrationData = body.registrationData

    // Check rate limiting for OTP requests
    const identifier = email || phone
    if (identifier) {
      const rateLimit = checkOTPRateLimit(request, identifier)
      
      if (!rateLimit.allowed) {
        return NextResponse.json({
          error: rateLimit.blocked 
            ? `Trop de demandes de code OTP. Réessayez dans ${Math.ceil((rateLimit.resetTime - Date.now()) / 60000)} minutes.`
            : 'Trop de demandes de code OTP. Veuillez réessayer plus tard.',
          rateLimit: {
            remaining: rateLimit.remaining,
            resetTime: rateLimit.resetTime,
            blocked: rateLimit.blocked
          }
        }, { status: 429 })
      }
    }

    // Handle registration data storage for deferred verification
    if (type === 'registration' && registrationData) {
      // Validate required fields before creating session
      const requiredFields = [
        'firstName', 'lastName', 'phone', 'email', 'dateOfBirth',
        'nationality', 'address', 'city', 'country', 'placeOfBirth',
        'statutEmploi', 'metiers', 'idType', 'idNumber', 'idIssueDate', 'idExpiryDate',
        'civilite', 'termsAccepted', 'privacyAccepted', 'signature'
      ]

      const missingFields = requiredFields.filter(field => !registrationData[field])

      if (missingFields.length > 0) {
        return NextResponse.json(
          { error: `Champs requis manquants: ${missingFields.join(', ')}` },
          { status: 400 }
        )
      }

      // Create or update temporary registration session
      const sessionExpiry = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

      const normalizedPhone = normalizeInternationalPhone(registrationData.phone || '')
      if (!normalizedPhone) {
        return NextResponse.json(
          { error: 'Format du numéro de téléphone invalide' },
          { status: 400 }
        )
      }

      const registrationSession = await prisma.registrationSession.create({
        data: {
          email: registrationData.email,
          phone: normalizedPhone,
          data: JSON.stringify({
            ...registrationData,
            phone: normalizedPhone,
            timestamp: new Date().toISOString()
          }),
          expiresAt: sessionExpiry,
          type: 'REGISTRATION'
        }
      })

      // Send OTP for the registration session
      const otpResult = await sendOTP(registrationData.email, normalizedPhone, 'register', method, registrationSession.id)

      if (!otpResult.success) {
        // Clean up failed session
        await prisma.registrationSession.delete({ where: { id: registrationSession.id } })
        return NextResponse.json(
          { error: 'Erreur lors de l\'envoi du code OTP' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        sessionId: registrationSession.id,
        message: 'Code OTP envoyé avec succès',
        method: method || 'email'
      })
    }

    // Handle login OTP (existing functionality)
    if (type === 'login') {
      if (!email && !phone) {
        return NextResponse.json(
          { error: 'Email ou numéro de téléphone requis' },
          { status: 400 }
        )
      }

      // Find user and send OTP
      const normalizedPhone = phone ? normalizeInternationalPhone(phone) : null
      let user: User | null = null

      if (email) {
        user = await prisma.user.findUnique({ where: { email } })
      } else if (normalizedPhone) {
        const phoneFormats = generatePhoneFormats(normalizedPhone)
        user = await prisma.user.findFirst({
          where: {
            OR: phoneFormats.map(format => ({ phone: format }))
          }
        })
      }

      if (!user) {
        if (email) {
          user = await findLegacyAuthUser({ email })
        }
      }

      if (!user) {
        return NextResponse.json(
          { error: 'Utilisateur non trouvé' },
          { status: 404 }
        )
      }

      const otpResult = await sendOTP(
        user.email || undefined,
        user.phone || undefined,
        'login',
        method || (email ? 'email' : 'sms')
      )
      if (!otpResult.success) {
        return NextResponse.json(
          { error: otpResult.message || 'Erreur lors de l\'envoi du code OTP' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Code OTP envoyé avec succès',
        method: method || (email ? 'email' : 'sms')
      })
    }

    // Handle password reset OTP
    if (type === 'password_reset') {
      if (!email && !phone) {
        return NextResponse.json(
          { error: 'Email ou numéro de téléphone requis' },
          { status: 400 }
        )
      }

      // Find user by email or phone
      const normalizedPhone = phone ? normalizeInternationalPhone(phone) : null
      let user: User | null = null

      if (email) {
        user = await prisma.user.findUnique({ where: { email } })
      } else if (normalizedPhone) {
        const phoneFormats = generatePhoneFormats(normalizedPhone)
        user = await prisma.user.findFirst({
          where: {
            OR: phoneFormats.map(format => ({ phone: format }))
          }
        })
      }

      if (!user) {
        if (email) {
          user = await findLegacyAuthUser({ email })
        }
      }

      if (!user) {
        return NextResponse.json(
          { error: 'Utilisateur non trouvé' },
          { status: 404 }
        )
      }

      // Check if this user exists in the main `users` table or only in legacy `user`
      const userInMainTable = await prisma.user.findFirst({ where: { id: user.id } })

      if (!userInMainTable) {
        // Legacy user: use a temporary registration session as OTP carrier
        // to avoid FK constraint violation against `users` table
        const deliveryEmail = email || user.email
        const deliveryPhone = phone || user.phone
        const otpMethod = method || (deliveryEmail ? 'email' : 'sms')
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const sessionExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        const session = await prisma.registrationSession.create({
          data: {
            email: user.email,
            phone: user.phone,
            data: JSON.stringify({ userId: user.id, purpose: 'password_reset' }),
            expiresAt: sessionExpiry,
            type: 'REGISTRATION',
          }
        })

        await prisma.otpCode.create({
          data: {
            userId: null,
            registrationSessionId: session.id,
            code: otp,
            type: otpMethod === 'email' ? 'EMAIL' : 'SMS',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          }
        })

        if (otpMethod === 'email' && deliveryEmail) {
          await sendEmailOTP(deliveryEmail, otp)
        } else if (deliveryPhone) {
          await sendSMSOTP(deliveryPhone, otp)
        }

        return NextResponse.json({
          success: true,
          message: 'Code OTP envoyé avec succès',
          method: otpMethod,
          sessionId: session.id,
        })
      }

      // Standard user: normal OTP flow
      const otpResult = await sendOTP(
        email || user.email || undefined,
        phone || user.phone || undefined,
        'login',
        method || (email ? 'email' : 'sms')
      )

      if (!otpResult.success) {
        return NextResponse.json(
          { error: otpResult.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Code OTP envoyé avec succès',
        method: email ? 'email' : 'sms'
      })
    }

    return NextResponse.json(
      { error: 'Type de demande non supporté' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Erreur lors de l\'envoi du code OTP:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
