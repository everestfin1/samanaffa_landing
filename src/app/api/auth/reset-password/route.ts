import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { findLegacyAuthUser, updateLegacyAuthUserPassword } from '@/lib/legacy-auth-user'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = body.email ? body.email.toString().trim().toLowerCase() : undefined
    const phone = body.phone ? body.phone.toString().trim() : undefined
    const newPassword = body.newPassword

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email ou numéro de téléphone requis' },
        { status: 400 }
      )
    }

    if (!newPassword) {
      return NextResponse.json(
        { error: 'Nouveau mot de passe requis' },
        { status: 400 }
      )
    }

    // Validate password strength comprehensively
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (newPassword.length < 8 || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial' },
        { status: 400 }
      )
    }

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : [])
        ]
      }
    })

    const fallbackLegacyUser = !user && email
      ? await findLegacyAuthUser({ email })
      : null

    const resolvedUser = user || fallbackLegacyUser

    if (!resolvedUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Hash the new password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(newPassword, saltRounds)

    // Update user password
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: passwordHash,
          updatedAt: new Date()
        }
      })
    } else {
      await updateLegacyAuthUserPassword(resolvedUser.id, passwordHash)
    }

    return NextResponse.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
