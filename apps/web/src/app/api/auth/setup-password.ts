import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const Route = createFileRoute('/api/auth/setup-password')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { userId, password } = await request.json()

          if (!userId) {
            return Response.json(
              { error: 'ID utilisateur requis' },
              { status: 400 }
            )
          }

          if (!password) {
            return Response.json(
              { error: 'Mot de passe requis' },
              { status: 400 }
            )
          }

          const hasUpperCase = /[A-Z]/.test(password)
          const hasLowerCase = /[a-z]/.test(password)
          const hasNumbers = /\d/.test(password)
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

          if (password.length < 8 || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            return Response.json(
              { error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial' },
              { status: 400 }
            )
          }

          const user = await prisma.user.findUnique({
            where: { id: userId }
          })

          if (!user) {
            return Response.json(
              { error: 'Utilisateur non trouvé' },
              { status: 404 }
            )
          }

          if (user.passwordHash) {
            return Response.json(
              { error: 'Un mot de passe a déjà été configuré pour ce compte' },
              { status: 400 }
            )
          }

          const saltRounds = 12
          const passwordHash = await bcrypt.hash(password, saltRounds)

          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
              passwordHash: passwordHash,
              updatedAt: new Date()
            }
          })

          return Response.json({
            success: true,
            message: 'Mot de passe configuré avec succès',
            user: {
              id: updatedUser.id,
              email: updatedUser.email,
              phone: updatedUser.phone,
              firstName: updatedUser.firstName,
              lastName: updatedUser.lastName
            }
          })
        } catch (error) {
          console.error('Erreur lors de la configuration du mot de passe:', error)
          return Response.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
          )
        }
      },
    },
  },
})
