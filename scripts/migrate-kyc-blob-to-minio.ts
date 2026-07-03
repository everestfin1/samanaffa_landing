/**
 * One-off migration: copy legacy Vercel Blob KYC files into MinIO.
 *
 * Usage (dry-run):
 *   tsx scripts/migrate-kyc-blob-to-minio.ts --dry-run
 *
 * Usage (apply):
 *   tsx scripts/migrate-kyc-blob-to-minio.ts
 *
 * Requires: DATABASE_URL, S3_* env vars, network access to blob URLs.
 */
import { config } from 'dotenv'
import { eq } from 'drizzle-orm'
import { db } from '../src/lib/db'
import { kycDocuments } from '../src/lib/db/schema'
import { isStorageConfigured } from '../src/lib/storage/config'
import { putObject } from '../src/lib/storage/minio'

config({ path: '.env.local' })
config({ path: '.env' })

const dryRun = process.argv.includes('--dry-run')

async function fetchBlob(url: string): Promise<{ buffer: Buffer; contentType: string }> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`)
  }
  const arrayBuffer = await res.arrayBuffer()
  const contentType = res.headers.get('content-type') ?? 'application/octet-stream'
  return { buffer: Buffer.from(arrayBuffer), contentType }
}

function guessExtension(fileName: string, contentType: string): string {
  if (fileName.includes('.')) return fileName.split('.').pop() ?? 'bin'
  if (contentType.includes('pdf')) return 'pdf'
  if (contentType.includes('png')) return 'png'
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg'
  return 'bin'
}

async function main() {
  if (!isStorageConfigured()) {
    console.error('S3/MinIO is not configured. Set S3_* variables.')
    process.exit(1)
  }

  const docs = await db.select().from(kycDocuments)

  const legacy = docs.filter(
    (d) =>
      d.documentType !== 'didit_kyc_session' &&
      (d.fileUrl.startsWith('http://') || d.fileUrl.startsWith('https://')) &&
      !d.fileUrl.startsWith('minio://'),
  )

  console.log(`Found ${legacy.length} legacy blob document(s) to migrate${dryRun ? ' (dry-run)' : ''}.`)

  let migrated = 0
  let skipped = 0
  let failed = 0

  for (const doc of legacy) {
    const storageKey = `legacy/${doc.userId}/${doc.id}.${guessExtension(doc.fileName, 'application/octet-stream')}`
    try {
      if (dryRun) {
        console.log(`[dry-run] would migrate ${doc.id} → ${storageKey}`)
        migrated++
        continue
      }

      const { buffer, contentType } = await fetchBlob(doc.fileUrl)
      const bucket = process.env.S3_BUCKET_KYC ?? 'samanaffa-kyc'
      await putObject(bucket, storageKey, buffer, contentType)

      await db
        .update(kycDocuments)
        .set({
          storageKey,
          source: 'legacy_blob',
          fileUrl: `minio://${bucket}/${storageKey}`,
        })
        .where(eq(kycDocuments.id, doc.id))

      console.log(`Migrated ${doc.id}`)
      migrated++
    } catch (err) {
      console.error(`Failed ${doc.id}:`, err instanceof Error ? err.message : err)
      failed++
    }
  }

  console.log({ migrated, skipped, failed })
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
