import { Hono } from 'hono'
import { db, desc, asc, sql, eq, and, or, like, gte, lte } from '../../lib/db.js'
import { formDrafts } from '../../lib/schema.js'
import { requireAdmin } from '../../middleware/auth.js'

const app = new Hono()

app.use('*', requireAdmin)

app.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const pageSize = parseInt(c.req.query('pageSize') || '20')
    const q = c.req.query('q') || ''
    const status = c.req.query('status') || ''
    const date = c.req.query('date') || ''
    const sortBy = c.req.query('sortBy') || 'lastActivityAt'
    const sortOrder = c.req.query('sortOrder') || 'desc'
    const offset = (page - 1) * pageSize

    const conditions = []

    if (q) {
      const searchTerm = `%${q.toLowerCase()}%`
      conditions.push(
        or(
          like(sql`lower(${formDrafts.email})`, searchTerm),
          like(sql`lower(${formDrafts.phone})`, searchTerm),
          like(sql`lower(${formDrafts.stepReached})`, searchTerm),
          like(sql`lower(${formDrafts.formType})`, searchTerm)
        )
      )
    }

    if (status) {
      conditions.push(like(sql`lower(${formDrafts.status}::text)`, `%${status.toLowerCase()}%`))
    }

    if (date) {
      const startOfDay = new Date(date)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      conditions.push(and(gte(formDrafts.lastActivityAt, startOfDay), lte(formDrafts.lastActivityAt, endOfDay)))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const sortColumn = sortBy === 'email' ? formDrafts.email : 
                       sortBy === 'status' ? formDrafts.status : 
                       sortBy === 'score' ? formDrafts.score : 
                       sortBy === 'stepReached' ? formDrafts.stepReached : formDrafts.lastActivityAt
    const orderFn = sortOrder === 'asc' ? asc : desc

    const [drafts, countResult, statsResult] = await Promise.all([
      db.select().from(formDrafts).where(whereClause).orderBy(orderFn(sortColumn)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(formDrafts).where(whereClause),
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
