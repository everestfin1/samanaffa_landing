import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp'
import { prisma } from '@/lib/prisma'
import { addMonths, generateAccountNumber, normalizeInternationalPhone } from '@/lib/utils'
import { getNaffaProductById } from '@/lib/naffa-products'

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
    const normalizedPhone = phone ? normalizeInternationalPhone(phone) : null
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
      // Final safety check: Ensure email and phone are still unique before finalizing
      const finalNormalizedPhone = normalizedPhone || user.phone;
      
      // Check if another user was created with same email (race condition protection)
      const duplicateEmailUser = await prisma.user.findFirst({
        where: { 
          email: user.email,
          id: { not: user.id }
        }
      });

      if (duplicateEmailUser) {
        // Delete the current user and return error
        await prisma.user.delete({ where: { id: user.id } });
        return NextResponse.json(
          { error: 'Cet email est déjà associé à un autre compte. Veuillez réessayer avec un autre email.' },
          { status: 409 }
        );
      }

      // Check if another user was created with same phone (race condition protection)
      const phoneFormats = [
        finalNormalizedPhone,
        finalNormalizedPhone.replace('+221', ''),
        finalNormalizedPhone.replace('+', ''),
        `+221${finalNormalizedPhone.replace('+221', '')}`
      ].filter((format, index, arr) => arr.indexOf(format) === index);

      let duplicatePhoneUser = null;
      for (const phoneFormat of phoneFormats) {
        duplicatePhoneUser = await prisma.user.findFirst({
          where: { 
            phone: phoneFormat,
            id: { not: user.id }
          }
        });
        if (duplicatePhoneUser) break;
      }

      if (duplicatePhoneUser) {
        // Delete the current user and return error
        await prisma.user.delete({ where: { id: user.id } });
        return NextResponse.json(
          { error: 'Ce numéro de téléphone est déjà associé à un autre compte. Veuillez réessayer avec un autre numéro.' },
          { status: 409 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: finalNormalizedPhone, // Ensure phone is normalized
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
          nationality: userData.nationality,
          address: userData.address,
          city: userData.city,
          country: userData.country,
          region: userData.region,
          district: userData.district,
          placeOfBirth: userData.placeOfBirth,
          statutEmploi: userData.statutEmploi,
          metiers: userData.metiers,
          domaineActivite: userData.domaineActivite,
          idType: userData.idType,
          idNumber: userData.idNumber,
          idIssueDate: userData.idIssueDate ? new Date(userData.idIssueDate) : null,
          idExpiryDate: userData.idExpiryDate ? new Date(userData.idExpiryDate) : null,
          civilite: userData.civilite,
          termsAccepted: userData.termsAccepted,
          privacyAccepted: userData.privacyAccepted,
          signature: userData.signature,
          marketingAccepted: userData.marketingAccepted,
          preferredLanguage: userData.preferredLanguage || 'fr',
          emailVerified: true,
          phoneVerified: true,
        }
      })

      // Auto-create both accounts (Sama Naffa + APE)
      const defaultNaffaProduct = getNaffaProductById(userData?.defaultNaffaProductId || 'default')
      const naffaLockMonths = defaultNaffaProduct.lockPeriodMonths ?? 0
      const naffaLockedUntil =
        naffaLockMonths > 0 ? addMonths(new Date(), naffaLockMonths) : null

      const samaNaffaAccount = await prisma.userAccount.create({
        data: {
          userId: user.id,
          accountType: 'SAMA_NAFFA',
          accountNumber: generateAccountNumber('SN'),
          productCode: defaultNaffaProduct.productCode,
          productName: defaultNaffaProduct.name,
          interestRate: defaultNaffaProduct.interestRate.toFixed(2),
          lockPeriodMonths: naffaLockMonths,
          lockedUntil: naffaLockedUntil,
          allowAdditionalDeposits: defaultNaffaProduct.allowAdditionalDeposits,
          metadata: defaultNaffaProduct.metadata
            ? defaultNaffaProduct.metadata
            : undefined,
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

    // For login or password reset, just return user data
    if (type === 'password_reset') {
      return NextResponse.json({
        success: true,
        message: 'Code OTP vérifié. Vous pouvez maintenant définir un nouveau mot de passe.',
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
        }
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
