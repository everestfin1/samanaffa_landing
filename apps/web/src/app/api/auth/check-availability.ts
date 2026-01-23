import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '@/lib/prisma'
import { normalizeInternationalPhone, generatePhoneFormats } from '@/lib/utils'

export const Route = createFileRoute('/api/auth/check-availability')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { email, phone } = await request.json()

          if (!email && !phone) {
            return Response.json(
              { error: 'Email ou numéro de téléphone requis' },
              { status: 400 }
            )
          }

          const result: { emailAvailable?: boolean; phoneAvailable?: boolean } = {}

          if (email) {
            const existingEmail = await prisma.user.findFirst({
              where: { email }
            })
            result.emailAvailable = !existingEmail
          }

          if (phone) {
            const normalizedPhone = normalizeInternationalPhone(phone)
            if (normalizedPhone) {
              const phoneFormats = generatePhoneFormats(normalizedPhone)
              let phoneExists = false

              for (const phoneFormat of phoneFormats) {
                const existingPhone = await prisma.user.findFirst({
                  where: { phone: phoneFormat }
                })
                if (existingPhone) {
                  phoneExists = true
                  break
                }
              }

              result.phoneAvailable = !phoneExists
            } else {
              result.phoneAvailable = false
            }
          }

          return Response.json({
            success: true,
            ...result
          })
        } catch (error) {
          console.error('Erreur lors de la vérification de disponibilité:', error)
          return Response.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
          )
        }
      },
    },
  },
})
