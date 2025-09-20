import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp'
import { prisma } from '@/lib/prisma'
import { normalizeSenegalPhone } from '@/lib/utils'
import { generateAccountNumber } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { email, phone, otp, type, userData } = await request.json()

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email ou numéro de téléphone requis' },
        { status: 400 }
      )
    }

    if (!otp) {
      return NextResponse.json(
        { error: 'Code OTP requis' },
        { status: 400 }
      )
    }

    // Normalize phone number for user lookup if provided
    const normalizedPhone = phone ? normalizeSenegalPhone(phone) : null
    console.log('🔍 Verify OTP Request:', { email, phone, otp, type })
    console.log('🔄 Phone normalization:', { original: phone, normalized: normalizedPhone })

    // Find user - try multiple phone formats for better compatibility
    let user = null

    if (email) {
      // First try email lookup
      user = await prisma.user.findFirst({
        where: { email }
      })
      console.log('🔍 Email lookup result:', { email, found: !!user })
    }

    if (!user && normalizedPhone) {
      // Try multiple phone number formats for lookup
      const phoneFormats = [
        normalizedPhone, // normalized format (should be +221XXXXXXXXX)
        normalizedPhone.replace('+221', ''), // without country code
        normalizedPhone.replace('+', ''), // without + sign
        `+221${normalizedPhone.replace('+221', '')}`, // ensure +221 prefix
      ].filter((format, index, arr) => arr.indexOf(format) === index) // remove duplicates

      console.log('🔍 Phone lookup formats to try:', phoneFormats)

      for (const phoneFormat of phoneFormats) {
        user = await prisma.user.findFirst({
          where: { phone: phoneFormat }
        })
        console.log('🔍 Phone lookup attempt:', { format: phoneFormat, found: !!user })

        if (user) {
          console.log('✅ User found with phone format:', phoneFormat)
          break
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Verify OTP
    const isValidOTP = await verifyOTP(user.id, otp)
    if (!isValidOTP) {
      return NextResponse.json(
        { error: 'Code OTP invalide ou expiré' },
        { status: 400 }
      )
    }

    // If this is registration, update user data
    if (type === 'register' && userData) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: normalizedPhone || user.phone, // Ensure phone is normalized
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
          nationality: userData.nationality,
          address: userData.address,
          city: userData.city,
          preferredLanguage: userData.preferredLanguage || 'fr',
          emailVerified: true,
          phoneVerified: true,
        }
      })

      // Auto-create both accounts (Sama Naffa + APE)
      const samaNaffaAccount = await prisma.userAccount.create({
        data: {
          userId: user.id,
          accountType: 'SAMA_NAFFA',
          accountNumber: generateAccountNumber('SN'),
        }
      })

      const apeAccount = await prisma.userAccount.create({
        data: {
          userId: user.id,
          accountType: 'APE_INVESTMENT',
          accountNumber: generateAccountNumber('APE'),
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Inscription terminée avec succès',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          phone: updatedUser.phone,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
        },
        accounts: [
          {
            type: 'SAMA_NAFFA',
            accountNumber: samaNaffaAccount.accountNumber,
          },
          {
            type: 'APE_INVESTMENT',
            accountNumber: apeAccount.accountNumber,
          }
        ]
      })
    }

    // For login, just return user data
    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    })
  } catch (error) {
    console.error('Erreur lors de la vérification du code OTP:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
