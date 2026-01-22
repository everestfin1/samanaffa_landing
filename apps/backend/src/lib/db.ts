import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq, desc, asc, sql, and, or, like, gte, lte, ne, isNull, isNotNull, inArray, notInArray } from 'drizzle-orm'

const neonSql = neon(process.env.DATABASE_URL!)
export const db = drizzle(neonSql)

export { eq, desc, asc, sql, and, or, like, gte, lte, ne, isNull, isNotNull, inArray, notInArray }
