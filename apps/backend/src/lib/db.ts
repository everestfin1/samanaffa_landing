import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq, desc, asc, sql, and, or, like, gte, lte, ne, isNull, isNotNull, inArray, notInArray } from 'drizzle-orm'

let _db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (_db) return _db

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set')
  }

  const neonSql = neon(databaseUrl)
  _db = drizzle(neonSql)
  return _db
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const realDb = getDb() as any
    return realDb[prop]
  },
})

export { eq, desc, asc, sql, and, or, like, gte, lte, ne, isNull, isNotNull, inArray, notInArray }
