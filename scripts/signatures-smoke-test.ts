/**
 * Smoke test for mandate signature uploads (Cloudflare R2 or local MinIO).
 *
 * Env (add to .env.local):
 *   S3_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
 *   S3_ACCESS_KEY=...
 *   S3_SECRET_KEY=...
 *   S3_BUCKET_SIGNATURES=samanaffa-signatures
 *   S3_REGION=auto
 *   S3_FORCE_PATH_STYLE=false
 */
import { loadProjectEnv } from './load-env'

loadProjectEnv()

import { isSignatureStorageConfigured } from '../src/lib/storage/config'
import {
  buildMandateSignatureKey,
  getMandateSignaturePresignedUrl,
  persistMandateSignature,
} from '../src/lib/storage/signatures'
import { isPersistedSignature, isStoredSignatureObject } from '../src/lib/signature'
import { objectExists } from '../src/lib/storage/minio'
import { getStorageConfig } from '../src/lib/storage/config'

const SAMPLE_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

async function main() {
  if (!isSignatureStorageConfigured()) {
    console.error('❌ Set S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET_SIGNATURES in .env.local')
    console.error('   (CLI scripts load .env.local — not the same as Next.js unless you restart the dev server)')
    process.exit(1)
  }

  const userId = `smoke-${Date.now()}`
  const config = getStorageConfig()
  const key = buildMandateSignatureKey(userId)

  console.log(`→ persistMandateSignature (${config.signaturesBucket})`)
  const result = await persistMandateSignature(userId, SAMPLE_PNG)

  if (result.storageBackend !== 'r2' || !isStoredSignatureObject(result.storedValue)) {
    console.error('❌ expected R2 object reference, got', result)
    process.exit(1)
  }

  const exists = await objectExists(config.signaturesBucket, key)
  if (!exists) {
    console.error('❌ object not found after upload')
    process.exit(1)
  }

  if (!isPersistedSignature(result.storedValue)) {
    console.error('❌ isPersistedSignature failed')
    process.exit(1)
  }

  const url = await getMandateSignaturePresignedUrl(result.storedValue, 60)
  if (!url) {
    console.error('❌ presigned URL generation failed')
    process.exit(1)
  }

  const res = await fetch(url)
  if (!res.ok) {
    console.error(`❌ presigned GET failed: ${res.status}`)
    process.exit(1)
  }

  console.log('✅ Signature storage smoke test passed')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
