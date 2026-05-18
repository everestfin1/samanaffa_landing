import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeProfileUser(user: any) {
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth,
    nationality: user.nationality,
    address: user.address,
    city: user.city,
    country: user.country,
    region: user.region,
    department: user.department,
    arrondissement: user.arrondissement,
    district: user.district,
    preferredLanguage: user.preferredLanguage,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    kycStatus: user.kycStatus,
    createdAt: user.createdAt,
    statutEmploi: user.statutEmploi,
    termsAccepted: user.termsAccepted,
    privacyAccepted: user.privacyAccepted,
    marketingAccepted: user.marketingAccepted,
    profileCompletionStatus: user.profileCompletionStatus,
    accounts: user.accounts ?? [],
    kycDocuments: user.kycDocuments ?? [],
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: (session?.user as any).id },
      include: {
        accounts: true,
        kycDocuments: {
          orderBy: { uploadDate: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: serializeProfileUser(user),
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Phone and email changes require dedicated flows (OTP / verification) — not this endpoint.
    if (body.phone !== undefined) {
      return NextResponse.json(
        {
          error:
            'La modification du numéro de téléphone nécessite une vérification par SMS (OTP). Cette fonctionnalité arrive bientôt.',
        },
        { status: 400 },
      )
    }
    if (body.email !== undefined) {
      return NextResponse.json(
        {
          error:
            'La modification de l\'adresse email n\'est pas disponible depuis cette page. Contactez le support si besoin.',
        },
        { status: 400 },
      )
    }

    const updateData: Record<string, unknown> = {}

    if (body.firstName !== undefined) {
      if (typeof body.firstName !== 'string' || !body.firstName.trim()) {
        return NextResponse.json({ error: 'Le prénom est requis.' }, { status: 400 })
      }
      updateData.firstName = body.firstName.trim()
    }
    if (body.lastName !== undefined) {
      if (typeof body.lastName !== 'string' || !body.lastName.trim()) {
        return NextResponse.json({ error: 'Le nom est requis.' }, { status: 400 })
      }
      updateData.lastName = body.lastName.trim()
    }
    if (body.address !== undefined) {
      updateData.address = typeof body.address === 'string' ? body.address.trim() : body.address
    }
    if (body.city !== undefined) {
      updateData.city = typeof body.city === 'string' ? body.city.trim() : body.city
    }
    if (body.country !== undefined) {
      updateData.country = typeof body.country === 'string' ? body.country.trim() : body.country
    }
    if (body.nationality !== undefined) {
      updateData.nationality =
        typeof body.nationality === 'string' ? body.nationality.trim() : body.nationality
    }
    if (body.preferredLanguage !== undefined) {
      updateData.preferredLanguage = body.preferredLanguage
    }
    if (body.region !== undefined) updateData.region = body.region
    if (body.department !== undefined) updateData.department = body.department
    if (body.arrondissement !== undefined) updateData.arrondissement = body.arrondissement
    if (body.district !== undefined) updateData.district = body.district

    if (body.dateOfBirth !== undefined) {
      if (body.dateOfBirth === null || body.dateOfBirth === '') {
        updateData.dateOfBirth = null
      } else {
        const dob = new Date(body.dateOfBirth)
        if (isNaN(dob.getTime())) {
          return NextResponse.json({ error: 'Date de naissance invalide.' }, { status: 400 })
        }
        updateData.dateOfBirth = dob
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Aucun champ modifiable fourni.' },
        { status: 400 },
      )
    }

    const userId = (session?.user as { id: string }).id

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
        kycDocuments: {
          orderBy: { uploadDate: 'desc' },
        },
      },
    })

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: serializeProfileUser(updatedUser),
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
