import { getStorageConfig, isSignatureStorageConfigured, parseMinioUri, toMinioUri } from '@/lib/storage/config'
import { getPresignedGetUrl, putObject } from '@/lib/storage/minio'
import { parseSignatureDataUrl } from '@/lib/signature'

export function buildMandateSignatureKey(userId: string): string {
  return `signatures/${userId}/mandate.png`
}

export interface PersistMandateSignatureResult {
  /** Value stored in `users.signature` — object URI or inline data URL fallback. */
  storedValue: string
  storageKey: string | null
  contentHash: string | null
  storageBackend: 'r2' | 'inline'
}

/**
 * Upload mandate signature PNG to S3-compatible storage (Cloudflare R2 in production).
 * Falls back to inline data URL when storage env is not configured (local dev).
 */
export async function persistMandateSignature(
  userId: string,
  dataUrl: string,
): Promise<PersistMandateSignatureResult> {
  const { buffer, contentType } = parseSignatureDataUrl(dataUrl)

  if (!isSignatureStorageConfigured()) {
    return {
      storedValue: dataUrl.trim(),
      storageKey: null,
      contentHash: null,
      storageBackend: 'inline',
    }
  }

  const config = getStorageConfig()
  const storageKey = buildMandateSignatureKey(userId)
  const { contentHash } = await putObject(
    config.signaturesBucket,
    storageKey,
    buffer,
    contentType,
  )

  return {
    storedValue: toMinioUri(storageKey),
    storageKey,
    contentHash,
    storageBackend: 'r2',
  }
}

/** Presigned GET URL for a stored mandate signature (admin / compliance). */
export async function getMandateSignaturePresignedUrl(
  signatureValue: string,
  ttlSeconds?: number,
): Promise<string | null> {
  if (!isSignatureStorageConfigured()) return null

  const key = parseMinioUri(signatureValue)
  if (!key?.startsWith('signatures/')) return null

  const config = getStorageConfig()
  return getPresignedGetUrl(config.signaturesBucket, key, ttlSeconds)
}
