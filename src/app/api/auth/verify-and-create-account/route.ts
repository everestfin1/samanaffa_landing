import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { verifyOTP } from '@/lib/otp'
import { prisma } from '@/lib/prisma'
import { addMonths, generateAccountNumber } from '@/lib/utils'
import { getNaffaProductById } from '@/lib/naffa-products'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, otp, password } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'ID de session requis' },
        { status: 400 }
      )
    }

    if (!otp) {
      return NextResponse.json(
        { error: 'Code OTP requis' },
        { status: 400 }
      )
    }

    // Find the registration session
    const registrationSession = await prisma.registrationSession.findUnique({
      where: { id: sessionId }
    })

    if (!registrationSession) {
      return NextResponse.json(
        { error: 'Session expirée ou invalide' },
        { status: 404 }
      )
    }

    // Check if session has expired
    if (registrationSession.expiresAt < new Date()) {
      // Clean up expired session
      await prisma.registrationSession.delete({ where: { id: sessionId } })
      return NextResponse.json(
        { error: 'Session expirée. Veuillez recommencer votre inscription.' },
        { status: 410 }
      )
    }

    // Verify OTP for the session
    const isValidOTP = await verifyOTP(sessionId, otp)
    if (!isValidOTP) {
      return NextResponse.json(
        { error: 'Code OTP invalide ou expiré' },
        { status: 400 }
      )
    }

    // Parse registration data
    const userData = JSON.parse(registrationSession.data)

    // Final safety check: Ensure email and phone are still unique
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { phone: userData.phone }
        ]
      }
    })

    if (existingUser) {
      // Clean up session
      await prisma.registrationSession.delete({ where: { id: sessionId } })
      return NextResponse.json(
        { error: 'Un utilisateur avec ces informations existe déjà' },
        { status: 409 }
      )
    }

    // Hash password if provided (for future password auth)
    let passwordHash = null
    if (password) {
      // TODO: Implement password hashing when adding password auth
      passwordHash = password // Temporary - will be hashed later
    }

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        phone: userData.phone,
        firstName: userData.firstName,
        lastName: userData.lastName,
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
        nationality: userData.nationality,
        address: userData.address,
        city: userData.city,
        country: userData.country,
        region: userData.region,
        department: userData.department,
        arrondissement: userData.arrondissement,
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
        marketingAccepted: userData.marketingAccepted,
        signature: userData.signature,
        preferredLanguage: userData.preferredLanguage || 'fr',
        emailVerified: true,
        phoneVerified: true,
        passwordHash: passwordHash,
        otpVerifiedAt: new Date(),
      }
    })

    // Auto-create both accounts (Sama Naffa + APE)
    const defaultNaffaProduct = getNaffaProductById(userData?.defaultNaffaProductId || 'default')
    const naffaLockMonths = defaultNaffaProduct.lockPeriodMonths ?? 0
    const naffaLockedUntil =
      naffaLockMonths > 0 ? addMonths(new Date(), naffaLockMonths) : null

    const samaNaffaAccount = await prisma.userAccount.create({
      data: {
        userId: newUser.id,
        accountType: 'SAMA_NAFFA',
        accountNumber: generateAccountNumber('SN'),
        productCode: defaultNaffaProduct.productCode,
        productName: defaultNaffaProduct.name,
        interestRate: new Prisma.Decimal(defaultNaffaProduct.interestRate.toFixed(2)),
        lockPeriodMonths: naffaLockMonths,
        lockedUntil: naffaLockedUntil,
        allowAdditionalDeposits: defaultNaffaProduct.allowAdditionalDeposits,
        metadata: defaultNaffaProduct.metadata
          ? (defaultNaffaProduct.metadata as Prisma.InputJsonValue)
          : undefined,
      }
    })

    const apeAccount = await prisma.userAccount.create({
      data: {
        userId: newUser.id,
        accountType: 'APE_INVESTMENT',
        accountNumber: generateAccountNumber('APE'),
      }
    })

    // Clean up the registration session
    await prisma.registrationSession.delete({ where: { id: sessionId } })

    return NextResponse.json({
      success: true,
      message: 'Inscription terminée avec succès',
      user: {
        id: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
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
      ],
      redirectUrl: password ? '/portal/dashboard' : '/login?message=password_setup_required'
    })
  } catch (error) {
    console.error('Erreur lors de la vérification OTP et création de compte:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
