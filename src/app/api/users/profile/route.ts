import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
      user: {
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
        accounts: user.accounts,
        kycDocuments: user.kycDocuments
      }
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

    const {
      firstName,
      lastName,
      dateOfBirth,
      nationality,
      address,
      city,
      country,
      region,
      department,
      arrondissement,
      district,
      preferredLanguage
    } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: (session?.user as any).id },
      data: {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        nationality,
        address,
        city,
        country,
        region,
        department,
        arrondissement,
        district,
        preferredLanguage
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        dateOfBirth: updatedUser.dateOfBirth,
        nationality: updatedUser.nationality,
        address: updatedUser.address,
        city: updatedUser.city,
        country: updatedUser.country,
        region: updatedUser.region,
        department: updatedUser.department,
        arrondissement: updatedUser.arrondissement,
        district: updatedUser.district,
        preferredLanguage: updatedUser.preferredLanguage,
        kycStatus: updatedUser.kycStatus,
      }
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
