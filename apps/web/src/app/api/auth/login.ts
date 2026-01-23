import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '@/lib/prisma'
import { normalizeInternationalPhone, generatePhoneFormats } from '@/lib/utils'
import { checkLoginRateLimit, resetRateLimit } from '@/lib/rate-limit'
import { sanitizeText, validateEmail } from '@/lib/sanitization'
import bcrypt from 'bcryptjs'
import type { User } from '@/lib/db/schema'

export const Route = createFileRoute('/api/auth/login')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { email, phone, password } = await request.json()

          const sanitizedEmail = email ? sanitizeText(email) : undefined
          const sanitizedPhone = phone ? sanitizeText(phone) : undefined

          if (sanitizedEmail && !validateEmail(sanitizedEmail)) {
            return Response.json(
              { error: 'Format d\'email invalide' },
              { status: 400 }
            )
          }

          const identifier = sanitizedEmail || sanitizedPhone
          const rateLimit = checkLoginRateLimit(request, identifier)

          if (!rateLimit.allowed) {
            return Response.json({
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
            return Response.json(
              { error: 'Mot de passe requis' },
              { status: 400 }
            )
          }

          if (!sanitizedEmail && !sanitizedPhone) {
            return Response.json(
              { error: 'Email ou numéro de téléphone requis' },
              { status: 400 }
            )
          }

          const normalizedPhone = sanitizedPhone ? normalizeInternationalPhone(sanitizedPhone) : null
          let user: User | null = null

          if (sanitizedEmail) {
            user = await prisma.user.findFirst({ where: { email: sanitizedEmail } })
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
              { error: 'Identifiants incorrects' },
              { status: 401 }
            )
          }

          if (user.lockedUntil && new Date() < user.lockedUntil) {
            const lockTimeRemaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000)
            return Response.json(
              { error: `Compte verrouillé. Réessayez dans ${lockTimeRemaining} minutes.` },
              { status: 423 }
            )
          }

          if (!user.passwordHash) {
            return Response.json(
              { error: 'password_not_set' },
              { status: 400 }
            )
          }

          const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
          if (!isPasswordValid) {
            const failedAttempts = (user.failedAttempts || 0) + 1
            const maxAttempts = 3

            let lockedUntil: Date | null = null
            if (failedAttempts >= maxAttempts) {
              lockedUntil = new Date(Date.now() + 30 * 60 * 1000)
            }

            await prisma.user.update({
              where: { id: user.id },
              data: { failedAttempts, lockedUntil }
            })

            return Response.json(
              { error: 'Identifiants incorrects' },
              { status: 401 }
            )
          }

          if (user.kycStatus === 'REJECTED') {
            return Response.json(
              { error: 'Votre compte a été suspendu. Veuillez contacter le support.' },
              { status: 403 }
            )
          }

          await prisma.user.update({
            where: { id: user.id },
            data: { failedAttempts: 0, lockedUntil: null }
          })
          resetRateLimit(request, 'login', identifier)

          return Response.json({
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
          return Response.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
          )
        }
      },
    },
  },
})
