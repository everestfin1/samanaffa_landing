/**
 * Smoke test for local MinIO (S3-compatible) storage.
 *
 * Prereqs:
 *   docker compose -f docker-compose.minio.yml up -d
 *
 * Env (add to .env.local):
 *   S3_ENDPOINT=http://127.0.0.1:9000
 *   S3_ACCESS_KEY=minioadmin
 *   S3_SECRET_KEY=minioadmin
 *   S3_BUCKET_DIDIT_ASSETS=samanaffa-didit-assets
 *   S3_BUCKET_KYC=samanaffa-kyc
 *   S3_FORCE_PATH_STYLE=true
 */
import { loadProjectEnv } from './load-env'

loadProjectEnv()

import { isStorageConfigured } from '../src/lib/storage/config'
import {
  buildDiditAssetKey,
  getPresignedGetUrl,
  objectExists,
  putObject,
} from '../src/lib/storage/minio'
import { getStorageConfig } from '../src/lib/storage/config'

async function main() {
  if (!isStorageConfigured()) {
    console.error('❌ S3_* env vars not set — see script header')
    process.exit(1)
  }

  const config = getStorageConfig()
  const key = buildDiditAssetKey('smoke-user', 'smoke-session', 'didit_id_front', 'jpg')
  const body = Buffer.from('minio-smoke-test')

  console.log(`→ putObject ${config.diditAssetsBucket}/${key}`)
  const { contentHash } = await putObject(config.diditAssetsBucket, key, body, 'image/jpeg')
  console.log(`  hash: ${contentHash.slice(0, 16)}…`)

  const exists = await objectExists(config.diditAssetsBucket, key)
  if (!exists) {
    console.error('❌ object not found after upload')
    process.exit(1)
  }

  const url = await getPresignedGetUrl(config.diditAssetsBucket, key, 60)
  const res = await fetch(url)
  if (!res.ok) {
    console.error(`❌ presigned GET failed: ${res.status}`)
    process.exit(1)
  }

  const downloaded = Buffer.from(await res.arrayBuffer())
  if (!downloaded.equals(body)) {
    console.error('❌ downloaded bytes mismatch')
    process.exit(1)
  }

  console.log('✅ MinIO smoke test passed')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
