import { getStorageConfig, parseMinioUri } from '@/lib/storage/config'
import type { KycDocument } from '@/lib/db/schema'

export function resolveKycDocumentStorageKey(doc: {
  storageKey?: string | null
  fileUrl: string
}): string | null {
  if (doc.storageKey?.trim()) return doc.storageKey.trim()
  return parseMinioUri(doc.fileUrl)
}

export function resolveKycDocumentBucket(doc: Pick<KycDocument, 'source'>): string {
  const { diditAssetsBucket, kycBucket } = getStorageConfig()
  if (doc.source === 'didit') return diditAssetsBucket
  return kycBucket
}
