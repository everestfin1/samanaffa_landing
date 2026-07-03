/**
 * BullMQ worker scaffold for srvstage background jobs.
 *
 * Deploy alongside the Next.js app:
 *   cd worker && npm install && npm start
 *
 * Env: REDIS_URL (default redis://127.0.0.1:6379)
 */
import { config } from 'dotenv'
import { resolve } from 'node:path'
import { Worker, Queue } from 'bullmq'
import IORedis from 'ioredis'

config({ path: resolve(process.cwd(), '../.env') })
config({ path: resolve(process.cwd(), '../.env.local') })

const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379'
const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null })

const QUEUE_NAME = 'samanaffa-jobs'

export const jobQueue = new Queue(QUEUE_NAME, { connection })

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    switch (job.name) {
      case 'ping':
        console.log('[worker] ping', job.data)
        return { ok: true }
      case 'email.send':
        console.log('[worker] email.send (stub)', job.data)
        return { queued: true }
      default:
        console.warn('[worker] unknown job', job.name)
        return { skipped: true }
    }
  },
  { connection },
)

worker.on('completed', (job) => {
  console.log(`[worker] completed ${job.id} (${job.name})`)
})

worker.on('failed', (job, err) => {
  console.error(`[worker] failed ${job?.id} (${job?.name})`, err.message)
})

console.log(`[worker] listening on ${redisUrl} queue=${QUEUE_NAME}`)

process.on('SIGTERM', async () => {
  await worker.close()
  await connection.quit()
  process.exit(0)
})
