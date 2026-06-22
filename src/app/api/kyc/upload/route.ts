import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { desc, eq } from 'drizzle-orm'
import { put } from '@vercel/blob'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { kycDocuments, users } from '@/lib/db/schema'
import { checkKYCRateLimit } from '@/lib/rate-limit'

async function requireSessionUserId(request: NextRequest): Promise<
  { userId: string } | NextResponse
> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const rateLimit = checkKYCRateLimit(request, session.user.id)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: rateLimit.blocked
          ? `Trop de téléchargements de documents. Réessayez dans ${Math.ceil((rateLimit.resetTime - Date.now()) / 60000)} minutes.`
          : 'Trop de téléchargements de documents. Veuillez réessayer plus tard.',
        rateLimit: {
          remaining: rateLimit.remaining,
          resetTime: rateLimit.resetTime,
          blocked: rateLimit.blocked,
        },
      },
      { status: 429 },
    )
  }

  return { userId: session.user.id }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireSessionUserId(request)
    if (auth instanceof NextResponse) {
      return auth
    }
    const { userId } = auth

    const formData = await request.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!documentType) {
      return NextResponse.json({ error: 'Document type is required' }, { status: 400 })
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPEG, and PNG files are allowed.' },
        { status: 400 },
      )
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 },
      )
    }

    const allowedDocumentTypes = [
      'national_id',
      'national_id_back',
      'passport',
      'selfie',
      'signature',
      'drivers_license',
      'utility_bill',
      'bank_statement',
      'employment_certificate',
      'other',
    ]

    if (!allowedDocumentTypes.includes(documentType)) {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
    }

    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const blob = await put(`kyc/${userId}/${Date.now()}-${file.name}`, file, {
      access: 'public',
    })

    const [kycDocument] = await db
      .insert(kycDocuments)
      .values({
        userId,
        documentType,
        fileUrl: blob.url,
        fileName: file.name,
      })
      .returning()

    if (!kycDocument) {
      return NextResponse.json({ error: 'Failed to save document' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: kycDocument.id,
        documentType: kycDocument.documentType,
        fileName: kycDocument.fileName,
        fileUrl: kycDocument.fileUrl,
        uploadDate: kycDocument.uploadDate,
        verificationStatus: kycDocument.verificationStatus,
      },
    })
  } catch (error) {
    console.error('Error uploading KYC document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireSessionUserId(request)
    if (auth instanceof NextResponse) {
      return auth
    }
    const { userId } = auth

    const docs = await db
      .select()
      .from(kycDocuments)
      .where(eq(kycDocuments.userId, userId))
      .orderBy(desc(kycDocuments.uploadDate))

    return NextResponse.json({
      success: true,
      documents: docs,
    })
  } catch (error) {
    console.error('Error fetching KYC documents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
