import { Hono } from 'hono'
import { db, desc, sql } from '../../lib/db.js'
import { formDrafts, peeLeads } from '../../lib/schema.js'
import { requireAdmin } from '../../middleware/auth.js'

const app = new Hono()

app.use('*', requireAdmin)

app.get('/abandoned', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const pageSize = parseInt(c.req.query('pageSize') || '20')
    const offset = (page - 1) * pageSize

    const [leads, countResult] = await Promise.all([
      db.select().from(formDrafts).orderBy(desc(formDrafts.lastActivityAt)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(formDrafts)
    ])

    return c.json({
      success: true,
      leads,
      pagination: {
        page,
        pageSize,
        total: Number(countResult[0].count),
        totalPages: Math.ceil(Number(countResult[0].count) / pageSize)
      }
    })
  } catch (error) {
    console.error('Error fetching abandoned leads:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.get('/pee', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const pageSize = parseInt(c.req.query('pageSize') || '20')
    const offset = (page - 1) * pageSize

    const [leads, countResult] = await Promise.all([
      db.select().from(peeLeads).orderBy(desc(peeLeads.createdAt)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(peeLeads)
    ])

    return c.json({
      success: true,
      leads,
      pagination: {
        page,
        pageSize,
        total: Number(countResult[0].count),
        totalPages: Math.ceil(Number(countResult[0].count) / pageSize)
      }
    })
  } catch (error) {
    console.error('Error fetching PEE leads:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

export default app
