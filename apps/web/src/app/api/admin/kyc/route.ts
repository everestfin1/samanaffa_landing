import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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

    const where = verificationStatus ? { verificationStatus: verificationStatus.toUpperCase() } : {}

    const [kycDocuments, total] = await Promise.all([
      prisma.kycDocument.findMany({
        where: where as any,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              kycStatus: true,
            }
          }
        },
        orderBy: { uploadDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.kycDocument.count({ where: where as any })
    ])

    return NextResponse.json({
      success: true,
      kycDocuments: kycDocuments.map((doc: any) => ({
        id: doc.id,
        documentType: doc.documentType,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        uploadDate: doc.uploadDate,
        verificationStatus: doc.verificationStatus,
        adminNotes: doc.adminNotes,
        user: {
          id: doc.user.id,
          name: `${doc.user.firstName} ${doc.user.lastName}`,
          email: doc.user.email,
          phone: doc.user.phone,
          kycStatus: doc.user.kycStatus,
        }
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error('Error fetching KYC documents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
