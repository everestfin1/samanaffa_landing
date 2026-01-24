import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/get-session'
import { db } from '@/lib/db'
import { users, userAccounts, kycDocuments as kycDocs } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(request)

    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await db
      .select()
      .from(users)
      .leftJoin(userAccounts, eq(users.id, userAccounts.userId))
      .leftJoin(kycDocs, eq(users.id, kycDocs.userId))
      .where(eq(users.id, (session?.user as any).id))
      .limit(1)

    if (!user || !user[0]) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userData = user[0].users
    // Group related data
    const accounts = user
      .filter(row => row.user_accounts)
      .map(row => row.user_accounts!)
    const kycDocuments = user
      .filter(row => row.kyc_documents)
      .sort((a, b) => new Date(b.kyc_documents!.uploadDate).getTime() - new Date(a.kyc_documents!.uploadDate).getTime())
      .map(row => row.kyc_documents!)

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        phone: userData.phone,
        firstName: userData.firstName,
        lastName: userData.lastName,
        dateOfBirth: userData.dateOfBirth,
        nationality: userData.nationality,
        address: userData.address,
        city: userData.city,
        country: userData.country,
        region: userData.region,
        department: userData.department,
        arrondissement: userData.arrondissement,
        district: userData.district,
        preferredLanguage: userData.preferredLanguage,
        emailVerified: userData.emailVerified,
        phoneVerified: userData.phoneVerified,
        kycStatus: userData.kycStatus,
        createdAt: userData.createdAt,
        accounts,
        kycDocuments
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
    const session = await getServerSession(request)

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

    const updatedUser = await db
      .update(users)
      .set({
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
      })
      .where(eq(users.id, (session?.user as any).id))
      .returning()

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser[0].id,
        email: updatedUser[0].email,
        phone: updatedUser[0].phone,
        firstName: updatedUser[0].firstName,
        lastName: updatedUser[0].lastName,
        dateOfBirth: updatedUser[0].dateOfBirth,
        nationality: updatedUser[0].nationality,
        address: updatedUser[0].address,
        city: updatedUser[0].city,
        country: updatedUser[0].country,
        region: updatedUser[0].region,
        department: updatedUser[0].department,
        arrondissement: updatedUser[0].arrondissement,
        district: updatedUser[0].district,
        preferredLanguage: updatedUser[0].preferredLanguage,
        kycStatus: updatedUser[0].kycStatus,
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
