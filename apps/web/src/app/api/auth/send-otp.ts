import { createFileRoute } from '@tanstack/react-router'
import { sendOTP } from '@/lib/otp'
import { prisma } from '@/lib/prisma'
import { normalizeInternationalPhone, generatePhoneFormats } from '@/lib/utils'
import { checkOTPRateLimit } from '@/lib/rate-limit'
import type { User } from '@/lib/db/schema'

export const Route = createFileRoute('/api/auth/send-otp')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { email, phone, type, method, registrationData } = await request.json()

          const identifier = email || phone
          if (identifier) {
            const rateLimit = checkOTPRateLimit(request, identifier)

            if (!rateLimit.allowed) {
              return Response.json({
                error: rateLimit.blocked
                  ? `Trop de demandes de code OTP. Réessayez dans ${Math.ceil((rateLimit.resetTime - Date.now()) / 60000)} minutes.`
                  : 'Trop de demandes de code OTP. Veuillez réessayer plus tard.',
                rateLimit: {
                  remaining: rateLimit.remaining,
                  resetTime: rateLimit.resetTime,
                  blocked: rateLimit.blocked
                }
              }, { status: 429 })
            }
          }

          if (type === 'registration' && registrationData) {
            const requiredFields = [
              'firstName', 'lastName', 'phone', 'email', 'dateOfBirth',
              'nationality', 'address', 'city', 'country', 'placeOfBirth',
              'statutEmploi', 'metiers', 'idType', 'idNumber', 'idIssueDate', 'idExpiryDate',
              'civilite', 'termsAccepted', 'privacyAccepted', 'signature'
            ]

            const missingFields = requiredFields.filter(field => !registrationData[field])

            if (missingFields.length > 0) {
              return Response.json(
                { error: `Champs requis manquants: ${missingFields.join(', ')}` },
                { status: 400 }
              )
            }

            const sessionExpiry = new Date(Date.now() + 30 * 60 * 1000)

            const normalizedPhone = normalizeInternationalPhone(registrationData.phone || '')
            if (!normalizedPhone) {
              return Response.json(
                { error: 'Format du numéro de téléphone invalide' },
                { status: 400 }
              )
            }

            const registrationSession = await prisma.registrationSession.create({
              data: {
                email: registrationData.email,
                phone: normalizedPhone,
                data: JSON.stringify({
                  ...registrationData,
                  phone: normalizedPhone,
                  timestamp: new Date().toISOString()
                }),
                expiresAt: sessionExpiry,
                type: 'REGISTRATION'
              }
            })

            const otpResult = await sendOTP(registrationData.email, normalizedPhone, 'register', method, registrationSession.id)

            if (!otpResult.success) {
              await prisma.registrationSession.delete({ where: { id: registrationSession.id } })
              return Response.json(
                { error: 'Erreur lors de l\'envoi du code OTP' },
                { status: 500 }
              )
            }

            return Response.json({
              success: true,
              sessionId: registrationSession.id,
              message: 'Code OTP envoyé avec succès',
              method: method || 'email'
            })
          }

          if (type === 'login') {
            if (!email && !phone) {
              return Response.json(
                { error: 'Email ou numéro de téléphone requis' },
                { status: 400 }
              )
            }

            const normalizedPhone = phone ? normalizeInternationalPhone(phone) : null
            let user: User | null = null

            if (email) {
              user = await prisma.user.findUnique({ where: { email } })
            } else if (normalizedPhone) {
              const phoneFormats = generatePhoneFormats(normalizedPhone)
              user = await prisma.user.findFirst({
                where: {
                  OR: phoneFormats.map(format => ({ phone: format }))
                }
              })
            }

            if (!user) {
              return Response.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
              )
            }

            const otpResult = await sendOTP(user.id, 'login')
            if (!otpResult.success) {
              return Response.json(
                { error: 'Erreur lors de l\'envoi du code OTP' },
                { status: 500 }
              )
            }

            return Response.json({
              success: true,
              message: 'Code OTP envoyé avec succès',
              method: method || 'email'
            })
          }

          if (type === 'password_reset') {
            if (!email && !phone) {
              return Response.json(
                { error: 'Email ou numéro de téléphone requis' },
                { status: 400 }
              )
            }

            const normalizedPhone = phone ? normalizeInternationalPhone(phone) : null
            let user: User | null = null

            if (email) {
              user = await prisma.user.findUnique({ where: { email } })
            } else if (normalizedPhone) {
              const phoneFormats = generatePhoneFormats(normalizedPhone)
              user = await prisma.user.findFirst({
                where: {
                  OR: phoneFormats.map(format => ({ phone: format }))
                }
              })
            }

            if (!user) {
              return Response.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
              )
            }

            const otpResult = await sendOTP(
              email || user.email,
              phone || user.phone,
              'login',
              email ? 'email' : 'sms'
            )

            if (!otpResult.success) {
              return Response.json(
                { error: otpResult.message },
                { status: 500 }
              )
            }

            return Response.json({
              success: true,
              message: 'Code OTP envoyé avec succès',
              method: email ? 'email' : 'sms'
            })
          }

          return Response.json(
            { error: 'Type de demande non supporté' },
            { status: 400 }
          )
        } catch (error) {
          console.error('Erreur lors de l\'envoi du code OTP:', error)
          return Response.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
          )
        }
      },
    },
  },
})
