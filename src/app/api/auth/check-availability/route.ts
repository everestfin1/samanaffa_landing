import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeInternationalPhone } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { email, phone } = await request.json()

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email ou numéro de téléphone requis' },
        { status: 400 }
      )
    }

    const checks = {
      emailAvailable: true,
      phoneAvailable: true,
      errors: [] as string[]
    }

    // Check email availability
    if (email) {
      const existingEmailUser = await prisma.user.findFirst({
        where: { email }
      })

      if (existingEmailUser) {
        checks.emailAvailable = false
        checks.errors.push('Cet email est déjà associé à un compte existant.')
      }
    }

    // Check phone availability
    if (phone) {
      const normalizedPhone = normalizeInternationalPhone(phone)
      
      if (!normalizedPhone) {
        checks.phoneAvailable = false
        checks.errors.push('Format de numéro de téléphone invalide.')
      } else {
        // Check multiple phone formats for existing users
        const phoneFormats = [
          normalizedPhone, // normalized format (+221XXXXXXXXX)
          normalizedPhone.replace('+221', ''), // without country code
          normalizedPhone.replace('+', ''), // without + sign
          `+221${normalizedPhone.replace('+221', '')}`, // ensure +221 prefix
        ].filter((format, index, arr) => arr.indexOf(format) === index) // remove duplicates

        console.log('🔍 Checking phone availability for formats:', phoneFormats)

        let phoneExists = false
        for (const phoneFormat of phoneFormats) {
          const existingPhoneUser = await prisma.user.findFirst({
            where: { phone: phoneFormat }
          })

          if (existingPhoneUser) {
            phoneExists = true
            console.log('📱 Phone exists with format:', phoneFormat)
            break
          }
        }

        if (phoneExists) {
          checks.phoneAvailable = false
          checks.errors.push('Ce numéro de téléphone est déjà associé à un compte existant.')
        }
      }
    }

    const isAvailable = checks.emailAvailable && checks.phoneAvailable

    return NextResponse.json({
      available: isAvailable,
      emailAvailable: checks.emailAvailable,
      phoneAvailable: checks.phoneAvailable,
      errors: checks.errors,
      message: isAvailable 
        ? 'Email et numéro de téléphone disponibles' 
        : 'Email ou numéro de téléphone déjà utilisé'
    })

  } catch (error) {
    console.error('Erreur lors de la vérification de disponibilité:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
