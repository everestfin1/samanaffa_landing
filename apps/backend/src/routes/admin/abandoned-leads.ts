import { Hono } from 'hono'
import { db, desc, sql, eq } from '../../lib/db.js'
import { formDrafts } from '../../lib/schema.js'
import { requireAdmin } from '../../middleware/auth.js'

const app = new Hono()

app.use('*', requireAdmin)

app.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const pageSize = parseInt(c.req.query('pageSize') || '20')
    const offset = (page - 1) * pageSize

    const [drafts, countResult, statsResult] = await Promise.all([
      db.select().from(formDrafts).orderBy(desc(formDrafts.lastActivityAt)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(formDrafts),
      db.select({
        status: formDrafts.status,
        count: sql<number>`count(*)`
      }).from(formDrafts).groupBy(formDrafts.status)
    ])

    const stats = {
      total: Number(countResult[0].count),
      abandoned: 0,
      contacted: 0,
      converted: 0,
      dismissed: 0
    }

    for (const row of statsResult) {
      const key = row.status.toLowerCase() as keyof typeof stats
      if (key in stats && key !== 'total') {
        stats[key] = Number(row.count)
      }
    }

    return c.json({
      success: true,
      drafts,
      stats,
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

app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const [draft] = await db.select().from(formDrafts).where(eq(formDrafts.id, id))
    
    if (!draft) {
      return c.json({ success: false, error: 'Draft not found' }, 404)
    }
    
    return c.json({ success: true, draft })
  } catch (error) {
    console.error('Error fetching abandoned lead:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { status, adminNotes } = body

    const updateData: Record<string, unknown> = {
      lastActivityAt: new Date()
    }

    if (status) updateData.status = status
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes
    if (status === 'CONVERTED') updateData.convertedAt = new Date()

    const [updated] = await db.update(formDrafts)
      .set(updateData)
      .where(eq(formDrafts.id, id))
      .returning()
    
    if (!updated) {
      return c.json({ success: false, error: 'Draft not found' }, 404)
    }
    
    return c.json({ success: true, draft: updated })
  } catch (error) {
    console.error('Error updating abandoned lead:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

export default app
