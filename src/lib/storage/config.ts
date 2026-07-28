/** S3-compatible object storage (MinIO on STELLARIX, Docker locally). */

export const MINIO_URI_PREFIX = 'minio://'

export interface StorageConfig {
  endpoint: string
  region: string
  accessKey: string
  secretKey: string
  diditAssetsBucket: string
  kycBucket: string
  signaturesBucket: string
  signedUrlTtlSeconds: number
}

export function isStorageConfigured(): boolean {
  return !!(
    process.env.S3_ENDPOINT &&
    process.env.S3_ACCESS_KEY &&
    process.env.S3_SECRET_KEY &&
    process.env.S3_BUCKET_DIDIT_ASSETS
  )
}

/** True when mandate signatures can be uploaded to S3-compatible storage (e.g. Cloudflare R2). */
export function isSignatureStorageConfigured(): boolean {
  return !!(
    process.env.S3_ENDPOINT &&
    process.env.S3_ACCESS_KEY &&
    process.env.S3_SECRET_KEY &&
    process.env.S3_BUCKET_SIGNATURES
  )
}

export function getStorageConfig(): StorageConfig {
  const endpoint = process.env.S3_ENDPOINT
  const accessKey = process.env.S3_ACCESS_KEY
  const secretKey = process.env.S3_SECRET_KEY

  if (!endpoint || !accessKey || !secretKey) {
    throw new Error(
      'Object storage is not configured (S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY)',
    )
  }

  return {
    endpoint,
    region: process.env.S3_REGION ?? 'auto',
    accessKey,
    secretKey,
    diditAssetsBucket: process.env.S3_BUCKET_DIDIT_ASSETS ?? 'samanaffa-didit-assets',
    kycBucket: process.env.S3_BUCKET_KYC ?? 'samanaffa-kyc',
    signaturesBucket: process.env.S3_BUCKET_SIGNATURES ?? 'samanaffa-signatures',
    signedUrlTtlSeconds: Number(process.env.S3_SIGNED_URL_TTL_SECONDS ?? '900'),
  }
}

/** @deprecated Use getStorageConfig — kept for signature smoke tests. */
export function getSignatureStorageConfig(): Pick<
  StorageConfig,
  'endpoint' | 'region' | 'accessKey' | 'secretKey' | 'signaturesBucket' | 'signedUrlTtlSeconds'
> {
  const config = getStorageConfig()
  if (!process.env.S3_BUCKET_SIGNATURES) {
    throw new Error('S3_BUCKET_SIGNATURES is not configured')
  }
  return {
    endpoint: config.endpoint,
    region: config.region,
    accessKey: config.accessKey,
    secretKey: config.secretKey,
    signaturesBucket: config.signaturesBucket,
    signedUrlTtlSeconds: config.signedUrlTtlSeconds,
  }
}

export function toMinioUri(storageKey: string): string {
  return `${MINIO_URI_PREFIX}${storageKey}`
}

export function parseMinioUri(fileUrl: string): string | null {
  if (!fileUrl.startsWith(MINIO_URI_PREFIX)) return null
  const key = fileUrl.slice(MINIO_URI_PREFIX.length)
  return key.length > 0 ? key : null
}

export function isMinioStored(fileUrl: string, storageKey?: string | null): boolean {
  if (storageKey?.trim()) return true
  return fileUrl.startsWith(MINIO_URI_PREFIX)
}
