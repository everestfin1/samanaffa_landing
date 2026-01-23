import { createFileRoute } from '@tanstack/react-router'
import { verifyOTP } from '@/lib/otp'
import { prisma } from '@/lib/prisma'
import { addMonths, generateAccountNumber, normalizeInternationalPhone } from '@/lib/utils'
import { getNaffaProductById } from '@/lib/naffa-products'

export const Route = createFileRoute('/api/auth/verify-and-create-account')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { sessionId, otp, password } = await request.json()

          if (!sessionId || !otp) {
            return Response.json(
              { error: 'Session ID et code OTP requis' },
              { status: 400 }
            )
          }

          const registrationSession = await prisma.registrationSession.findUnique({
            where: { id: sessionId }
          })

          if (!registrationSession) {
            return Response.json(
              { error: 'Session d\'inscription non trouvée ou expirée' },
              { status: 404 }
            )
          }

          if (new Date() > registrationSession.expiresAt) {
            await prisma.registrationSession.delete({ where: { id: sessionId } })
            return Response.json(
              { error: 'Session d\'inscription expirée. Veuillez recommencer.' },
              { status: 410 }
            )
          }

          const isValidOTP = await verifyOTP(sessionId, otp)
          if (!isValidOTP) {
            return Response.json(
              { error: 'Code OTP invalide ou expiré' },
              { status: 400 }
            )
          }

          const registrationData = JSON.parse(registrationSession.data as string)
          const normalizedPhone = normalizeInternationalPhone(registrationData.phone)

          const existingUser = await prisma.user.findFirst({
            where: {
              OR: [
                { email: registrationData.email },
                { phone: normalizedPhone }
              ]
            }
          })

          if (existingUser) {
            await prisma.registrationSession.delete({ where: { id: sessionId } })
            return Response.json(
              { error: 'Un compte existe déjà avec cet email ou numéro de téléphone' },
              { status: 409 }
            )
          }

          let passwordHash: string | undefined = undefined
          if (password) {
            const bcrypt = await import('bcryptjs')
            passwordHash = await bcrypt.hash(password, 12)
          }

          const user = await prisma.user.create({
            data: {
              email: registrationData.email,
              phone: normalizedPhone,
              passwordHash,
              firstName: registrationData.firstName,
              lastName: registrationData.lastName,
              dateOfBirth: registrationData.dateOfBirth ? new Date(registrationData.dateOfBirth) : null,
              nationality: registrationData.nationality,
              address: registrationData.address,
              city: registrationData.city,
              country: registrationData.country,
              region: registrationData.region,
              placeOfBirth: registrationData.placeOfBirth,
              statutEmploi: registrationData.statutEmploi,
              metiers: registrationData.metiers,
              domaineActivite: registrationData.domaineActivite,
              idType: registrationData.idType,
              idNumber: registrationData.idNumber,
              idIssueDate: registrationData.idIssueDate ? new Date(registrationData.idIssueDate) : null,
              idExpiryDate: registrationData.idExpiryDate ? new Date(registrationData.idExpiryDate) : null,
              civilite: registrationData.civilite,
              termsAccepted: registrationData.termsAccepted,
              privacyAccepted: registrationData.privacyAccepted,
              signature: registrationData.signature,
              marketingAccepted: registrationData.marketingAccepted,
              preferredLanguage: registrationData.preferredLanguage || 'fr',
              emailVerified: true,
              phoneVerified: true,
            }
          })

          const defaultNaffaProduct = getNaffaProductById(registrationData?.defaultNaffaProductId || 'default')
          const naffaLockMonths = defaultNaffaProduct.lockPeriodMonths ?? 0
          const naffaLockedUntil = naffaLockMonths > 0 ? addMonths(new Date(), naffaLockMonths) : null

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
              metadata: defaultNaffaProduct.metadata ? defaultNaffaProduct.metadata : undefined,
            }
          })

          const apeAccount = await prisma.userAccount.create({
            data: {
              userId: user.id,
              accountType: 'APE_INVESTMENT',
              accountNumber: generateAccountNumber('APE'),
            }
          })

          await prisma.registrationSession.delete({ where: { id: sessionId } })

          return Response.json({
            success: true,
            message: 'Compte créé avec succès',
            user: {
              id: user.id,
              email: user.email,
              phone: user.phone,
              firstName: user.firstName,
              lastName: user.lastName,
            },
            accounts: [
              { type: 'SAMA_NAFFA', accountNumber: samaNaffaAccount.accountNumber },
              { type: 'APE_INVESTMENT', accountNumber: apeAccount.accountNumber }
            ]
          })
        } catch (error) {
          console.error('Erreur lors de la création du compte:', error)
          return Response.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
          )
        }
      },
    },
  },
})
