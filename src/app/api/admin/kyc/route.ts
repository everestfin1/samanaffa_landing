import { NextRequest, NextResponse } from 'next/server'
import { and, count, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { kycDocuments, users } from '@/lib/db/schema'
import type { VerificationStatus } from '@/lib/types'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  // Verify admin authentication
  const { error, user } = await verifyAdminAuth(request)
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401)
  }
  try {
    const { searchParams } = new URL(request.url)
    const verificationStatus = searchParams.get('verificationStatus')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const whereClause = verificationStatus
      ? eq(kycDocuments.verificationStatus, verificationStatus.toUpperCase() as VerificationStatus)
      : undefined

    const [rows, totalResult] = await Promise.all([
      db
        .select({
          id: kycDocuments.id,
          documentType: kycDocuments.documentType,
          fileName: kycDocuments.fileName,
          fileUrl: kycDocuments.fileUrl,
          storageKey: kycDocuments.storageKey,
          source: kycDocuments.source,
          diditSessionId: kycDocuments.diditSessionId,
          uploadDate: kycDocuments.uploadDate,
          verificationStatus: kycDocuments.verificationStatus,
          adminNotes: kycDocuments.adminNotes,
          userId: kycDocuments.userId,
          userFirstName: users.firstName,
          userLastName: users.lastName,
          userEmail: users.email,
          userPhone: users.phone,
          userKycStatus: users.kycStatus,
        })
        .from(kycDocuments)
        .innerJoin(users, eq(kycDocuments.userId, users.id))
        .where(whereClause)
        .orderBy(desc(kycDocuments.uploadDate))
        .limit(limit)
        .offset(skip),
      db
        .select({ total: count() })
        .from(kycDocuments)
        .where(whereClause),
    ])

    const total = Number(totalResult[0]?.total ?? 0)

    return NextResponse.json({
      success: true,
      kycDocuments: rows.map((doc) => ({
        id: doc.id,
        documentType: doc.documentType,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        storageKey: doc.storageKey,
        source: doc.source,
        diditSessionId: doc.diditSessionId,
        uploadDate: doc.uploadDate,
        verificationStatus: doc.verificationStatus,
        adminNotes: doc.adminNotes,
        user: {
          id: doc.userId,
          name: `${doc.userFirstName} ${doc.userLastName}`,
          email: doc.userEmail,
          phone: doc.userPhone,
          kycStatus: doc.userKycStatus,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching KYC documents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
