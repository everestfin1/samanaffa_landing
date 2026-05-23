import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Email availability for authenticated profile completion only.
 * Phone enumeration is intentionally not supported here (AUTH-007 / ONB-050);
 * duplicate phones are handled generically via create-account / send-otp.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateLimit = checkRateLimit(request, 'login', ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez plus tard.' },
        { status: 429 },
      )
    }

    const session = await getServerSession(authOptions)
    const { email, phone } = await request.json()

    if (phone) {
      return NextResponse.json(
        { error: 'La vérification du téléphone n\'est pas disponible sur cette route.' },
        { status: 400 },
      )
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 },
      )
    }

    const userId = (session?.user as { id?: string } | undefined)?.id
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 },
      )
    }

    const normalizedEmail = normalizeEmail(email)

    const existingEmailUser = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        NOT: { id: userId },
      },
    })

    const emailAvailable = !existingEmailUser

    return NextResponse.json({
      available: emailAvailable,
      emailAvailable,
      phoneAvailable: true,
      errors: emailAvailable
        ? []
        : ['Cet email est déjà associé à un compte existant.'],
      message: emailAvailable
        ? 'Email disponible'
        : 'Email déjà utilisé',
    })
  } catch (error) {
    console.error('Erreur lors de la vérification de disponibilité:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}
