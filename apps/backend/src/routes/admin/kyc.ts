import { Hono } from 'hono'
import { db, desc, asc, sql, eq, and, or, like, gte, lte } from '../../lib/db.js'
import { kycDocuments } from '../../lib/schema.js'
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
    const sortBy = c.req.query('sortBy') || 'uploadDate'
    const sortOrder = c.req.query('sortOrder') || 'desc'
    const offset = (page - 1) * pageSize

    const conditions = []

    if (q) {
      const searchTerm = `%${q.toLowerCase()}%`
      conditions.push(
        or(
          like(sql`lower(${kycDocuments.documentType})`, searchTerm),
          like(sql`lower(${kycDocuments.fileName})`, searchTerm),
          like(sql`lower(${kycDocuments.userId})`, searchTerm)
        )
      )
    }

    if (status) {
      conditions.push(like(sql`lower(${kycDocuments.verificationStatus}::text)`, `%${status.toLowerCase()}%`))
    }

    if (date) {
      const startOfDay = new Date(date)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      conditions.push(and(gte(kycDocuments.uploadDate, startOfDay), lte(kycDocuments.uploadDate, endOfDay)))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const sortColumn = sortBy === 'documentType' ? kycDocuments.documentType : 
                       sortBy === 'status' ? kycDocuments.verificationStatus : kycDocuments.uploadDate
    const orderFn = sortOrder === 'asc' ? asc : desc

    const [docs, countResult] = await Promise.all([
      db.select().from(kycDocuments).where(whereClause).orderBy(orderFn(sortColumn)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(kycDocuments).where(whereClause)
    ])

    return c.json({
      success: true,
      kycDocuments: docs,
      pagination: {
        page,
        pageSize,
        total: Number(countResult[0].count),
        totalPages: Math.ceil(Number(countResult[0].count) / pageSize)
      }
    })
  } catch (error) {
    console.error('Error fetching KYC documents:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const [doc] = await db.select().from(kycDocuments).where(eq(kycDocuments.id, id))
    
    if (!doc) {
      return c.json({ success: false, error: 'Document not found' }, 404)
    }
    
    return c.json({ success: true, kycDocument: doc })
  } catch (error) {
    console.error('Error fetching KYC document:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { verificationStatus, adminNotes } = body

    const [updated] = await db.update(kycDocuments)
      .set({ 
        verificationStatus, 
        adminNotes 
      })
      .where(eq(kycDocuments.id, id))
      .returning()
    
    if (!updated) {
      return c.json({ success: false, error: 'Document not found' }, 404)
    }
    
    return c.json({ success: true, kycDocument: updated })
  } catch (error) {
    console.error('Error updating KYC document:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

export default app
