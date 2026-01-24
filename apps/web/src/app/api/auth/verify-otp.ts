import { createFileRoute } from '@tanstack/react-router'
import { verifyOTP } from '@/lib/otp'
import { prisma } from '@/lib/prisma'
import { addMonths, generateAccountNumber, normalizeInternationalPhone, generatePhoneFormats } from '@/lib/utils'
import { getNaffaProductById } from '@/lib/naffa-products'
import type { User } from '@/lib/db/schema'

export const Route = createFileRoute('/api/auth/verify-otp')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { email, phone, otp, type, userData } = await request.json()

          if (!email && !phone) {
            return Response.json(
              { error: 'Email ou numéro de téléphone requis' },
              { status: 400 }
            )
          }

          if (!otp) {
            return Response.json(
              { error: 'Code OTP requis' },
              { status: 400 }
            )
          }

          const normalizedPhone = phone ? normalizeInternationalPhone(phone) : null
          let user: User | null = null

          if (email) {
            user = await prisma.user.findFirst({ where: { email } })
          }

          if (!user && normalizedPhone) {
            const phoneFormats = generatePhoneFormats(normalizedPhone)
            for (const phoneFormat of phoneFormats) {
              user = await prisma.user.findFirst({ where: { phone: phoneFormat } })
              if (user) break
            }
          }

          if (!user) {
            return Response.json(
              { error: 'Utilisateur non trouvé' },
              { status: 404 }
            )
          }

          const isValidOTP = await verifyOTP(user.id, otp)
          if (!isValidOTP) {
            return Response.json(
              { error: 'Code OTP invalide ou expiré' },
              { status: 400 }
            )
          }

          if (type === 'register' && userData) {
            const finalNormalizedPhone = normalizedPhone || user.phone || ''

            const duplicateEmailUser = await prisma.user.findFirst({
              where: { email: user.email, id: { not: user.id } }
            })

            if (duplicateEmailUser) {
              await prisma.user.delete({ where: { id: user.id } })
              return Response.json(
                { error: 'Cet email est déjà associé à un autre compte.' },
                { status: 409 }
              )
            }

            const phoneFormats = generatePhoneFormats(finalNormalizedPhone)
            let duplicatePhoneUser: User | null = null
            for (const phoneFormat of phoneFormats) {
              duplicatePhoneUser = await prisma.user.findFirst({
                where: { phone: phoneFormat, id: { not: user.id } }
              })
              if (duplicatePhoneUser) break
            }

            if (duplicatePhoneUser) {
              await prisma.user.delete({ where: { id: user.id } })
              return Response.json(
                { error: 'Ce numéro de téléphone est déjà associé à un autre compte.' },
                { status: 409 }
              )
            }

            const updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: {
                firstName: userData.firstName,
                lastName: userData.lastName,
                phone: finalNormalizedPhone,
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

            const defaultNaffaProduct = getNaffaProductById(userData?.defaultNaffaProductId || 'default')
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

            return Response.json({
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
                { type: 'SAMA_NAFFA', accountNumber: samaNaffaAccount.accountNumber },
                { type: 'APE_INVESTMENT', accountNumber: apeAccount.accountNumber }
              ]
            })
          }

          if (type === 'password_reset') {
            return Response.json({
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

          return Response.json({
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
          return Response.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
          )
        }
      },
    },
  },
})
