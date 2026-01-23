import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const Route = createFileRoute('/api/auth/reset-password')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { email, phone, newPassword } = await request.json()

          if (!email && !phone) {
            return Response.json(
              { error: 'Email ou numéro de téléphone requis' },
              { status: 400 }
            )
          }

          if (!newPassword) {
            return Response.json(
              { error: 'Nouveau mot de passe requis' },
              { status: 400 }
            )
          }

          const hasUpperCase = /[A-Z]/.test(newPassword)
          const hasLowerCase = /[a-z]/.test(newPassword)
          const hasNumbers = /\d/.test(newPassword)
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)

          if (newPassword.length < 8 || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            return Response.json(
              { error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial' },
              { status: 400 }
            )
          }

          const user = await prisma.user.findFirst({
            where: {
              OR: [
                ...(email ? [{ email }] : []),
                ...(phone ? [{ phone }] : [])
              ]
            }
          })

          if (!user) {
            return Response.json(
              { error: 'Utilisateur non trouvé' },
              { status: 404 }
            )
          }

          const saltRounds = 12
          const passwordHash = await bcrypt.hash(newPassword, saltRounds)

          await prisma.user.update({
            where: { id: user.id },
            data: {
              passwordHash: passwordHash,
              updatedAt: new Date()
            }
          })

          return Response.json({
            success: true,
            message: 'Mot de passe réinitialisé avec succès'
          })
        } catch (error) {
          console.error('Erreur lors de la réinitialisation du mot de passe:', error)
          return Response.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
          )
        }
      },
    },
  },
})
