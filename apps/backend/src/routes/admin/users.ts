import { Hono } from 'hono'
import { db, desc, sql } from '../../lib/db.js'
import { users } from '../../lib/schema.js'
import { requireAdmin } from '../../middleware/auth.js'

const app = new Hono()

app.use('*', requireAdmin)

app.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const pageSize = parseInt(c.req.query('pageSize') || '20')
    const offset = (page - 1) * pageSize

    const [userList, countResult] = await Promise.all([
      db.select().from(users).orderBy(desc(users.createdAt)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(users)
    ])

    return c.json({
      success: true,
      users: userList,
      pagination: {
        page,
        pageSize,
        total: Number(countResult[0].count),
        totalPages: Math.ceil(Number(countResult[0].count) / pageSize)
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

export default app
