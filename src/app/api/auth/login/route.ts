import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeInternationalPhone } from '@/lib/utils'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, phone, password, type } = await request.json()

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email ou numéro de téléphone requis' },
        { status: 400 }
      )
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Mot de passe requis' },
        { status: 400 }
      )
    }

    // Normalize phone number if provided
    const normalizedPhone = phone ? normalizeInternationalPhone(phone) : null

    // Find user by email or phone (try multiple phone formats for better compatibility)
    let user = null

    if (email) {
      // First try email lookup
      user = await prisma.user.findFirst({
        where: { email }
      })
    }

    if (!user && normalizedPhone) {
      // Try multiple phone number formats for lookup
      const phoneFormats = [
        normalizedPhone, // normalized format (should be +221XXXXXXXXX)
        normalizedPhone.replace('+221', ''), // without country code
        normalizedPhone.replace('+', ''), // without + sign
        `+221${normalizedPhone.replace('+221', '')}`, // ensure +221 prefix
      ].filter((format, index, arr) => arr.indexOf(format) === index) // remove duplicates

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
