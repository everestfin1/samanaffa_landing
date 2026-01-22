import { Hono } from 'hono'
import { db, desc, sql, eq } from '../../lib/db.js'
import { transactionIntents } from '../../lib/schema.js'
import { requireAdmin } from '../../middleware/auth.js'

const app = new Hono()

app.use('*', requireAdmin)

app.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const pageSize = parseInt(c.req.query('pageSize') || '20')
    const offset = (page - 1) * pageSize

    const [transactions, countResult] = await Promise.all([
      db.select().from(transactionIntents).orderBy(desc(transactionIntents.createdAt)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(transactionIntents)
    ])

    return c.json({
      success: true,
      transactions,
      pagination: {
        page,
        pageSize,
        total: Number(countResult[0].count),
        totalPages: Math.ceil(Number(countResult[0].count) / pageSize)
      }
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()

    const updated = await db.update(transactionIntents)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(transactionIntents.id, id))
      .returning()

    if (!updated[0]) {
      return c.json({ success: false, error: 'Transaction not found' }, 404)
    }

    return c.json({ success: true, transaction: updated[0] })
  } catch (error) {
    console.error('Error updating transaction:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

export default app
