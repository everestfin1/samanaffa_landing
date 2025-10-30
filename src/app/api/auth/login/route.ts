import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeInternationalPhone, generatePhoneFormats } from '@/lib/utils'
import { checkLoginRateLimit, resetRateLimit } from '@/lib/rate-limit'
import { sanitizeText, validateEmail } from '@/lib/sanitization'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, phone, password, type } = await request.json()

    // Sanitize and validate input
    const sanitizedEmail = email ? sanitizeText(email) : undefined
    const sanitizedPhone = phone ? sanitizeText(phone) : undefined
    
    if (sanitizedEmail && !validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Check rate limiting for login attempts
    const identifier = sanitizedEmail || sanitizedPhone
    const rateLimit = checkLoginRateLimit(request, identifier)
    
    if (!rateLimit.allowed) {
      return NextResponse.json({
        error: rateLimit.blocked 
          ? `Trop de tentatives de connexion. Réessayez dans ${Math.ceil((rateLimit.resetTime - Date.now()) / 60000)} minutes.`
          : 'Trop de tentatives de connexion. Veuillez réessayer plus tard.',
        rateLimit: {
          remaining: rateLimit.remaining,
          resetTime: rateLimit.resetTime,
          blocked: rateLimit.blocked
        }
      }, { status: 429 })
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Mot de passe requis' },
        { status: 400 }
      )
    }

    if (!sanitizedEmail && !sanitizedPhone) {
      return NextResponse.json(
        { error: 'Email ou numéro de téléphone requis' },
        { status: 400 }
      )
    }

    // Normalize phone number if provided
    const normalizedPhone = sanitizedPhone ? normalizeInternationalPhone(sanitizedPhone) : null

    // Find user by email or phone (try multiple phone formats for better compatibility)
    let user = null

    if (sanitizedEmail) {
      // First try email lookup
      user = await prisma.user.findFirst({
        where: { email: sanitizedEmail }
      })
    }

    if (!user && normalizedPhone) {
      // Try multiple phone number formats for lookup
      const phoneFormats = generatePhoneFormats(normalizedPhone)

      for (const phoneFormat of phoneFormats) {
        user = await prisma.user.findFirst({
          where: { phone: phoneFormat }
        })

        if (user) {
          break
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      )
    }

    // Check if account is locked
    if (user.lockedUntil && new Date() < user.lockedUntil) {
      const lockTimeRemaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000)
      return NextResponse.json(
        { error: `Compte verrouillé. Réessayez dans ${lockTimeRemaining} minutes.` },
        { status: 423 }
      )
    }

    // Check if user has a password set
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: 'password_not_set' },
        { status: 400 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      // Increment failed attempts
      const failedAttempts = (user.failedAttempts || 0) + 1
      const maxAttempts = 3
      
      let lockedUntil = null
      if (failedAttempts >= maxAttempts) {
        lockedUntil = new Date(Date.now() + 30 * 60 * 1000) // Lock for 30 minutes
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts,
          lockedUntil
        }
      })

      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      )
    }

    // Check if user account is active
    if (user.kycStatus === 'REJECTED') {
      return NextResponse.json(
        { error: 'Votre compte a été suspendu. Veuillez contacter le support.' },
        { status: 403 }
      )
    }

    // Reset failed attempts and rate limit on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedAttempts: 0,
        lockedUntil: null
      }
    })
    resetRateLimit(request, 'login', identifier)

    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        kycStatus: user.kycStatus
      }
    })
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
