import { Hono } from 'hono'
import { db, desc, sql, eq, and, or, like, gte, lte } from '../../lib/db.js'
import { peeLeads } from '../../lib/schema.js'
import { requireAdmin } from '../../middleware/auth.js'

const app = new Hono()

app.use('*', requireAdmin)

app.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const pageSize = parseInt(c.req.query('pageSize') || '20')
    const q = c.req.query('q') || ''
    const status = c.req.query('status') || ''
    const country = c.req.query('country') || ''
    const date = c.req.query('date') || ''
    const offset = (page - 1) * pageSize

    const conditions = []

    if (q) {
      const searchTerm = `%${q.toLowerCase()}%`
      conditions.push(
        or(
          like(sql`lower(${peeLeads.prenom})`, searchTerm),
          like(sql`lower(${peeLeads.nom})`, searchTerm),
          like(sql`lower(coalesce(${peeLeads.email}, ''))`, searchTerm),
          like(sql`lower(${peeLeads.telephone})`, searchTerm)
        )
      )
    }

    if (status) {
      conditions.push(like(sql`lower(${peeLeads.status}::text)`, `%${status.toLowerCase()}%`))
    }

    if (country) {
      conditions.push(eq(peeLeads.country, country.toUpperCase() as any))
    }

    if (date) {
      const startOfDay = new Date(date)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      conditions.push(and(gte(peeLeads.createdAt, startOfDay), lte(peeLeads.createdAt, endOfDay)))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [leads, countResult] = await Promise.all([
      db.select().from(peeLeads).where(whereClause).orderBy(desc(peeLeads.createdAt)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(peeLeads).where(whereClause)
    ])

    return c.json({
      success: true,
      peeLeads: leads,
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

app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const [lead] = await db.select().from(peeLeads).where(eq(peeLeads.id, id))
    
    if (!lead) {
      return c.json({ success: false, error: 'Lead not found' }, 404)
    }
    
    return c.json({ success: true, peeLead: lead })
  } catch (error) {
    console.error('Error fetching PEE lead:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { status, adminNotes } = body

    const [updated] = await db.update(peeLeads)
      .set({ 
        status, 
        adminNotes,
        updatedAt: new Date()
      })
      .where(eq(peeLeads.id, id))
      .returning()
    
    if (!updated) {
      return c.json({ success: false, error: 'Lead not found' }, 404)
    }
    
    return c.json({ success: true, peeLead: updated })
  } catch (error) {
    console.error('Error updating PEE lead:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

export default app
