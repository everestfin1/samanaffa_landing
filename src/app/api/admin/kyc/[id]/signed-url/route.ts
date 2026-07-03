import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { kycDocuments } from '@/lib/db/schema'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'
import { isStorageConfigured } from '@/lib/storage/config'
import {
  resolveKycDocumentBucket,
  resolveKycDocumentStorageKey,
} from '@/lib/storage/kyc-document-access'
import { getPresignedGetUrl } from '@/lib/storage/minio'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, user } = await verifyAdminAuth(request)
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401)
  }

  const { id } = await params

  try {
    const [doc] = await db
      .select()
      .from(kycDocuments)
      .where(eq(kycDocuments.id, id))
      .limit(1)

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (doc.documentType === 'didit_kyc_session') {
      return NextResponse.json(
        { error: 'Session marker — open a rapatriated asset document instead' },
        { status: 400 },
      )
    }

    const storageKey = resolveKycDocumentStorageKey(doc)
    if (storageKey && isStorageConfigured()) {
      const bucket = resolveKycDocumentBucket(doc)
      const url = await getPresignedGetUrl(bucket, storageKey)
      return NextResponse.json({
        success: true,
        url,
        expiresInSeconds: Number(process.env.S3_SIGNED_URL_TTL_SECONDS ?? '900'),
        source: 'minio',
      })
    }

    if (doc.fileUrl.startsWith('http://') || doc.fileUrl.startsWith('https://')) {
      return NextResponse.json({
        success: true,
        url: doc.fileUrl,
        source: 'legacy_url',
      })
    }

    return NextResponse.json(
      { error: 'No accessible file for this document' },
      { status: 404 },
    )
  } catch (err) {
    console.error('[admin/kyc/signed-url]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
