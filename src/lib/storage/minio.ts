import { createHash } from 'crypto'
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getStorageConfig, type StorageConfig } from '@/lib/storage/config'

let cachedClient: S3Client | null = null
let cachedConfig: StorageConfig | null = null

function getClient(): { client: S3Client; config: StorageConfig } {
  if (!cachedClient || !cachedConfig) {
    const config = getStorageConfig()
    cachedConfig = config
    cachedClient = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      },
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
    })
  }
  return { client: cachedClient, config: cachedConfig }
}

export function buildDiditAssetKey(
  userId: string,
  sessionId: string,
  assetType: string,
  extension: string,
): string {
  const safeExt = extension.replace(/^\./, '').toLowerCase()
  return `didit/${userId}/${sessionId}/${assetType}.${safeExt}`
}

export async function putObject(
  bucket: string,
  key: string,
  body: Buffer,
  contentType: string,
): Promise<{ contentHash: string }> {
  const { client } = getClient()
  const contentHash = createHash('sha256').update(body).digest('hex')

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )

  return { contentHash }
}

export async function objectExists(bucket: string, key: string): Promise<boolean> {
  const { client } = getClient()
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    return true
  } catch {
    return false
  }
}

export async function getPresignedGetUrl(
  bucket: string,
  key: string,
  ttlSeconds?: number,
): Promise<string> {
  const { client, config } = getClient()
  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  return getSignedUrl(client, command, {
    expiresIn: ttlSeconds ?? config.signedUrlTtlSeconds,
  })
}

export async function downloadUrl(url: string, maxAttempts = 3): Promise<Buffer> {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const arrayBuffer = await res.arrayBuffer()
      return Buffer.from(arrayBuffer)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 500))
      }
    }
  }

  throw lastError ?? new Error('Download failed')
}

export function guessContentType(url: string, fallback = 'application/octet-stream'): string {
  const path = url.split('?')[0]?.toLowerCase() ?? ''
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg'
  if (path.endsWith('.png')) return 'image/png'
  if (path.endsWith('.webp')) return 'image/webp'
  if (path.endsWith('.pdf')) return 'application/pdf'
  if (path.endsWith('.mp4')) return 'video/mp4'
  return fallback
}

export function guessExtension(url: string, contentType: string): string {
  const path = url.split('?')[0]?.toLowerCase() ?? ''
  if (path.endsWith('.jpeg')) return 'jpg'
  if (path.match(/\.(jpg|png|webp|pdf|mp4)$/)) {
    return path.split('.').pop() ?? 'bin'
  }
  if (contentType.includes('jpeg')) return 'jpg'
  if (contentType.includes('png')) return 'png'
  if (contentType.includes('webp')) return 'webp'
  if (contentType.includes('pdf')) return 'pdf'
  if (contentType.includes('mp4')) return 'mp4'
  return 'bin'
}

/** Reset cached client (tests). */
export function resetStorageClientForTests(): void {
  cachedClient = null
  cachedConfig = null
}
