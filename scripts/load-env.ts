import { config } from 'dotenv'
import { existsSync } from 'fs'
import { resolve } from 'path'

/**
 * Load `.env.local` then `.env` for CLI scripts (Next.js only auto-loads these for `next dev`).
 */
export function loadProjectEnv(): void {
  const root = resolve(__dirname, '..')
  const localPath = resolve(root, '.env.local')
  const envPath = resolve(root, '.env')

  if (existsSync(localPath)) {
    config({ path: localPath })
  }
  if (existsSync(envPath)) {
    config({ path: envPath, override: false })
  }
}
