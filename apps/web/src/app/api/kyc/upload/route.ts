import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { db } from '@/lib/db'
import { users, kycDocuments } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { checkKYCRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const documentType = formData.get('documentType') as string

    // Check rate limiting for KYC uploads
    if (userId) {
      const rateLimit = checkKYCRateLimit(request, userId)
      
      if (!rateLimit.allowed) {
        return NextResponse.json({
          error: rateLimit.blocked 
            ? `Trop de téléchargements de documents. Réessayez dans ${Math.ceil((rateLimit.resetTime - Date.now()) / 60000)} minutes.`
            : 'Trop de téléchargements de documents. Veuillez réessayer plus tard.',
          rateLimit: {
            remaining: rateLimit.remaining,
            resetTime: rateLimit.resetTime,
            blocked: rateLimit.blocked
          }
        }, { status: 429 })
      }
    }

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!documentType) {
      return NextResponse.json(
        { error: 'Document type is required' },
        { status: 400 }
      )
    }

    // Validate file type (KYC documents only)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPEG, and PNG files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB for KYC docs)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Validate document type
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
      'other'
    ]

    if (!allowedDocumentTypes.includes(documentType)) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user || user.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Upload file to Vercel Blob
    const blob = await put(`kyc/${userId}/${Date.now()}-${file.name}`, file, {
      access: 'public',
    })

    // Save document record to database
    const kycDocumentResult = await db
      .insert(kycDocuments)
      .values({
        userId,
        documentType,
        fileUrl: blob.url,
        fileName: file.name,
      })
      .returning()
    
    const kycDocument = kycDocumentResult[0]

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
      }
    })
  } catch (error) {
    console.error('Error uploading KYC document:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const kycDocumentsData = await db
      .select()
      .from(kycDocuments)
      .where(eq(kycDocuments.userId, userId))
      .orderBy(desc(kycDocuments.uploadDate))

    return NextResponse.json({
      success: true,
      documents: kycDocumentsData
    })
  } catch (error) {
    console.error('Error fetching KYC documents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
