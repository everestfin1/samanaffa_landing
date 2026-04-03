import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { normalizeInternationalPhone, generatePhoneFormats } from '@/lib/utils'
import { checkLoginRateLimit, resetRateLimit } from '@/lib/rate-limit'
import { sanitizeText, validateEmail } from '@/lib/sanitization'
import { findLegacyAuthUser, resetLegacyAuthLockState, updateLegacyAuthLockState } from '@/lib/legacy-auth-user'
import bcrypt from 'bcryptjs'
import type { User } from '@/lib/db/schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password, type } = body

    // Sanitize and validate input
    const sanitizedEmail = body.email ? sanitizeText(body.email).trim().toLowerCase() : undefined
    const sanitizedPhone = body.phone ? sanitizeText(body.phone).trim() : undefined
    
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
    let user: User | null = null
    let userSource: 'users' | 'legacy_user' = 'users'

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

    // Fallback to legacy NextAuth user table during migration
    if (!user && sanitizedEmail) {
      user = await findLegacyAuthUser({ email: sanitizedEmail })
      if (user) {
        userSource = 'legacy_user'
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

    // Check if user has a password set - check both users table and legacy account table
    let hasPassword = !!user.passwordHash
    
    // Also check the account table for legacy users (even if found in users table)
    if (!hasPassword) {
      try {
        const legacyAccountResult = await db.execute(sql`
          select password from "account"
          where "user_id" = ${user.id} and "provider_id" = 'credential'
          limit 1
        `)
        const legacyAccount = (legacyAccountResult as any).rows?.[0]
        hasPassword = !!legacyAccount?.password
      } catch (error) {
        console.error('Error checking legacy account password:', error)
      }
    }
    
    if (!hasPassword) {
      return NextResponse.json(
        { error: 'password_not_set' },
        { status: 400 }
      )
    }

    // Verify password - check both users table and legacy account table
    let isPasswordValid = false
    
    // First check users table
    if (user.passwordHash) {
      try {
        isPasswordValid = await bcrypt.compare(password, user.passwordHash)
      } catch (e) {
        console.error('Error comparing users table password:', e)
      }
    }
    
    // If not valid, also check legacy account table
    if (!isPasswordValid) {
      try {
        const legacyAccountResult = await db.execute(sql`
          select password from "account"
          where "user_id" = ${user.id} and "provider_id" = 'credential'
          limit 1
        `)
        const legacyAccount = (legacyAccountResult as any).rows?.[0]
        if (legacyAccount?.password) {
          let hashToCompare = legacyAccount.password
          if (legacyAccount.password.includes(':')) {
            const [, hashPart] = legacyAccount.password.split(':')
            hashToCompare = hashPart
          }
          try {
            isPasswordValid = await bcrypt.compare(password, hashToCompare)
          } catch (e) {
            console.error('Error comparing legacy password:', e)
          }
        }
      } catch (legacyError) {
        console.error('Error checking legacy account:', legacyError)
      }
    }
    
    if (!isPasswordValid) {
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
    if (userSource === 'legacy_user') {
      await resetLegacyAuthLockState(user.id)
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: 0,
          lockedUntil: null
        }
      })
    }
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
