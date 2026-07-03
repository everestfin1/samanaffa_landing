import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { kycDocuments } from '@/lib/db/schema'
import type { DiditDecision } from '@/lib/didit-decision'
import { fetchDiditDecisionPdf } from '@/lib/didit-decision'
import { getStorageConfig, isStorageConfigured, toMinioUri } from '@/lib/storage/config'
import { extractDiditAssetsFromDecision } from '@/lib/storage/didit-assets-extract'
import {
  buildDiditAssetKey,
  downloadUrl,
  guessContentType,
  guessExtension,
  objectExists,
  putObject,
} from '@/lib/storage/minio'

export interface PersistDiditAssetsResult {
  stored: number
  skipped: number
  failed: number
}

async function hasStoredAsset(
  userId: string,
  sessionId: string,
  documentType: string,
): Promise<boolean> {
  const [existing] = await db
    .select({ id: kycDocuments.id })
    .from(kycDocuments)
    .where(
      and(
        eq(kycDocuments.userId, userId),
        eq(kycDocuments.diditSessionId, sessionId),
        eq(kycDocuments.documentType, documentType),
        eq(kycDocuments.source, 'didit'),
      ),
    )
    .limit(1)

  return !!existing
}

async function storeAsset(
  userId: string,
  sessionId: string,
  verificationStatus: string,
  candidate: { documentType: string; fileName: string; url: string },
  bucket: string,
): Promise<'stored' | 'skipped' | 'failed'> {
  if (await hasStoredAsset(userId, sessionId, candidate.documentType)) {
    return 'skipped'
  }

  try {
    const body = await downloadUrl(candidate.url)
    const contentType = guessContentType(candidate.url)
    const extension = guessExtension(candidate.url, contentType)
    const storageKey = buildDiditAssetKey(
      userId,
      sessionId,
      candidate.documentType,
      extension,
    )

    if (!(await objectExists(bucket, storageKey))) {
      const { contentHash } = await putObject(bucket, storageKey, body, contentType)
      await db.insert(kycDocuments).values({
        userId,
        documentType: candidate.documentType,
        fileName: candidate.fileName,
        fileUrl: toMinioUri(storageKey),
        storageKey,
        source: 'didit',
        diditSessionId: sessionId,
        contentHash,
        verificationStatus: verificationStatus as typeof kycDocuments.$inferInsert.verificationStatus,
      })
    } else {
      await db.insert(kycDocuments).values({
        userId,
        documentType: candidate.documentType,
        fileName: candidate.fileName,
        fileUrl: toMinioUri(storageKey),
        storageKey,
        source: 'didit',
        diditSessionId: sessionId,
        verificationStatus: verificationStatus as typeof kycDocuments.$inferInsert.verificationStatus,
      })
    }

    return 'stored'
  } catch (error) {
    console.error(
      `[didit-assets] Failed to store ${candidate.documentType} for session ${sessionId}:`,
      error,
    )
    return 'failed'
  }
}

async function storeDecisionPdf(
  userId: string,
  sessionId: string,
  verificationStatus: string,
  bucket: string,
): Promise<'stored' | 'skipped' | 'failed'> {
  const documentType = 'didit_decision_pdf'
  if (await hasStoredAsset(userId, sessionId, documentType)) {
    return 'skipped'
  }

  try {
    const pdfBuffer = await fetchDiditDecisionPdf(sessionId)
    if (!pdfBuffer) return 'skipped'

    const storageKey = buildDiditAssetKey(userId, sessionId, documentType, 'pdf')
    if (!(await objectExists(bucket, storageKey))) {
      const { contentHash } = await putObject(
        bucket,
        storageKey,
        pdfBuffer,
        'application/pdf',
      )
      await db.insert(kycDocuments).values({
        userId,
        documentType,
        fileName: 'didit-decision.pdf',
        fileUrl: toMinioUri(storageKey),
        storageKey,
        source: 'didit',
        diditSessionId: sessionId,
        contentHash,
        verificationStatus: verificationStatus as typeof kycDocuments.$inferInsert.verificationStatus,
      })
    } else {
      await db.insert(kycDocuments).values({
        userId,
        documentType,
        fileName: 'didit-decision.pdf',
        fileUrl: toMinioUri(storageKey),
        storageKey,
        source: 'didit',
        diditSessionId: sessionId,
        verificationStatus: verificationStatus as typeof kycDocuments.$inferInsert.verificationStatus,
      })
    }

    return 'stored'
  } catch (error) {
    console.error(`[didit-assets] Failed to store PDF for session ${sessionId}:`, error)
    return 'failed'
  }
}

/**
 * Download Didit presigned media into sovereign MinIO storage and record kyc_documents rows.
 * No-op when S3 env is not configured (local dev without MinIO).
 */
export async function persistDiditAssets(
  userId: string,
  sessionId: string,
  verificationStatus: string,
  decision?: DiditDecision | null,
): Promise<PersistDiditAssetsResult> {
  if (!isStorageConfigured()) {
    console.warn('[didit-assets] Storage not configured — skipping asset rapatriement')
    return { stored: 0, skipped: 0, failed: 0 }
  }

  const { diditAssetsBucket } = getStorageConfig()
  const payload = decision ?? null
  if (!payload) {
    return { stored: 0, skipped: 0, failed: 0 }
  }

  const candidates = extractDiditAssetsFromDecision(payload)
  const result: PersistDiditAssetsResult = { stored: 0, skipped: 0, failed: 0 }

  for (const candidate of candidates) {
    const status = await storeAsset(
      userId,
      sessionId,
      verificationStatus,
      candidate,
      diditAssetsBucket,
    )
    result[status] += 1
  }

  const pdfStatus = await storeDecisionPdf(
    userId,
    sessionId,
    verificationStatus,
    diditAssetsBucket,
  )
  result[pdfStatus] += 1

  console.info(
    `[didit-assets] session=${sessionId} stored=${result.stored} skipped=${result.skipped} failed=${result.failed}`,
  )

  return result
}
