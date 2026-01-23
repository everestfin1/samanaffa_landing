import { Hono } from 'hono'
import { db, desc, sql, eq } from '../../lib/db.js'
import { kycDocuments } from '../../lib/schema.js'
import { requireAdmin } from '../../middleware/auth.js'

const app = new Hono()

app.use('*', requireAdmin)

app.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const pageSize = parseInt(c.req.query('pageSize') || '20')
    const offset = (page - 1) * pageSize

    const [docs, countResult] = await Promise.all([
      db.select().from(kycDocuments).orderBy(desc(kycDocuments.uploadDate)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(kycDocuments)
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
