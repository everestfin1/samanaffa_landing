/** S3-compatible object storage (MinIO on STELLARIX, Docker locally). */

export const MINIO_URI_PREFIX = 'minio://'

export interface StorageConfig {
  endpoint: string
  region: string
  accessKey: string
  secretKey: string
  diditAssetsBucket: string
  kycBucket: string
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

export function getStorageConfig(): StorageConfig {
  const endpoint = process.env.S3_ENDPOINT
  const accessKey = process.env.S3_ACCESS_KEY
  const secretKey = process.env.S3_SECRET_KEY
  const diditAssetsBucket = process.env.S3_BUCKET_DIDIT_ASSETS

  if (!endpoint || !accessKey || !secretKey || !diditAssetsBucket) {
    throw new Error(
      'Object storage is not configured (S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET_DIDIT_ASSETS)',
    )
  }

  return {
    endpoint,
    region: process.env.S3_REGION ?? 'us-east-1',
    accessKey,
    secretKey,
    diditAssetsBucket,
    kycBucket: process.env.S3_BUCKET_KYC ?? 'samanaffa-kyc',
    signedUrlTtlSeconds: Number(process.env.S3_SIGNED_URL_TTL_SECONDS ?? '900'),
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
