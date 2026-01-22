import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp'
import { prisma } from '@/lib/prisma'
import { db, users } from '@/lib/db'
import { or, eq, and, not, inArray } from 'drizzle-orm'
import { addMonths, generateAccountNumber, generatePhoneFormats } from '@/lib/utils'
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
    // Exclude temporary users that were created during OTP sending
    // Check multiple phone formats for better compatibility
    const phoneFormats = generatePhoneFormats(userData.phone)

    console.log('🔍 Checking for existing users with:');
    console.log('Email:', userData.email);
    console.log('Phone formats:', phoneFormats);
    
    // Use raw Drizzle queries to properly handle OR/NOT clauses
    // Find ALL users with matching email or phone
    const allMatchingUsers = await db.select()
      .from(users)
      .where(
        or(
          eq(users.email, userData.email),
          ...phoneFormats.map(format => eq(users.phone, format))
        )!
      )

    console.log('🔍 Found matching users:', allMatchingUsers.length);
    allMatchingUsers.forEach(user => {
      console.log('  -', {
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        isTemporary: user.firstName === 'Temporary' && user.lastName === 'User'
      });
    });

    // Filter out temporary users - find real users only
    const existingRealUser = allMatchingUsers.find(
      user => !(user.firstName === 'Temporary' && user.lastName === 'User')
    );

    console.log('🔍 Found existing real user?', !!existingRealUser);
    if (existingRealUser) {
      console.log('🔍 Existing real user details:', {
        id: existingRealUser.id,
        email: existingRealUser.email,
        phone: existingRealUser.phone,
        firstName: existingRealUser.firstName,
        lastName: existingRealUser.lastName
      });
      
      // Clean up session
      await prisma.registrationSession.delete({ where: { id: sessionId } })
      return NextResponse.json(
        { error: 'Un utilisateur avec ces informations existe déjà' },
        { status: 409 }
      )
    }

    // Delete temporary users if any exist
    const temporaryUsers = allMatchingUsers.filter(
      user => user.firstName === 'Temporary' && user.lastName === 'User'
    );

    if (temporaryUsers.length > 0) {
      console.log('🧹 Deleting', temporaryUsers.length, 'temporary users');
      if (temporaryUsers.length === 1) {
        await prisma.user.delete({ where: { id: temporaryUsers[0].id } })
      } else {
        // Use raw Drizzle for deleteMany since helpers might not support it
        await db.delete(users)
          .where(
            or(...temporaryUsers.map(u => eq(users.id, u.id)))!
          )
      }
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
