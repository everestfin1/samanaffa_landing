import { Hono } from 'hono'
import { db, desc, asc, sql, eq, and, or, like, gte, lte } from '../../lib/db.js'
import { transactionIntents, users } from '../../lib/schema.js'
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
    const sortBy = c.req.query('sortBy') || 'createdAt'
    const sortOrder = c.req.query('sortOrder') || 'desc'
    const offset = (page - 1) * pageSize

    const conditions = []

    if (q) {
      const searchTerm = `%${q.toLowerCase()}%`
      conditions.push(
        or(
          like(sql`lower(${transactionIntents.referenceNumber})`, searchTerm),
          like(sql`lower(${transactionIntents.paymentMethod})`, searchTerm),
          like(sql`${transactionIntents.amount}::text`, `%${q}%`)
        )
      )
    }

    if (status) {
      conditions.push(like(sql`lower(${transactionIntents.status}::text)`, `%${status.toLowerCase()}%`))
    }

    if (date) {
      const startOfDay = new Date(date)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      conditions.push(and(gte(transactionIntents.createdAt, startOfDay), lte(transactionIntents.createdAt, endOfDay)))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const sortColumn = sortBy === 'amount' ? transactionIntents.amount : 
                       sortBy === 'status' ? transactionIntents.status : 
                       sortBy === 'type' ? transactionIntents.intentType : transactionIntents.createdAt
    const orderFn = sortOrder === 'asc' ? asc : desc

    const [transactions, countResult] = await Promise.all([
      db.select().from(transactionIntents).where(whereClause).orderBy(orderFn(sortColumn)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(transactionIntents).where(whereClause)
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
