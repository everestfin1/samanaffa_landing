import { Hono } from 'hono'
import { db, desc, asc, sql, and, or, like, gte, lte, eq } from '../../lib/db.js'
import { users } from '../../lib/schema.js'
import { requireAdmin } from '../../middleware/auth.js'
import { notifyKycStatusChange } from '../../lib/notifications.js'

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
          like(sql`lower(${users.firstName})`, searchTerm),
          like(sql`lower(${users.lastName})`, searchTerm),
          like(sql`lower(${users.email})`, searchTerm),
          like(sql`lower(${users.phone})`, searchTerm)
        )
      )
    }

    if (status) {
      conditions.push(like(sql`lower(${users.kycStatus}::text)`, `%${status.toLowerCase()}%`))
    }

    if (date) {
      const startOfDay = new Date(date)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      conditions.push(and(gte(users.createdAt, startOfDay), lte(users.createdAt, endOfDay)))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const sortColumn = sortBy === 'name' ? users.firstName : 
                       sortBy === 'email' ? users.email : 
                       sortBy === 'status' ? users.kycStatus : users.createdAt
    const orderFn = sortOrder === 'asc' ? asc : desc

    const [userList, countResult] = await Promise.all([
      db.select().from(users).where(whereClause).orderBy(orderFn(sortColumn)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(users).where(whereClause)
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

app.patch('/:id/kyc-status', async (c) => {
  try {
    const id = c.req.param('id')
    const { status } = await c.req.json()

    if (!['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'].includes(status)) {
      return c.json({ success: false, error: 'Invalid status' }, 400)
    }

    const [updated] = await db.update(users)
      .set({ kycStatus: status, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning()

    if (!updated) {
      return c.json({ success: false, error: 'User not found' }, 404)
    }

    // Trigger email/SMS notification for KYC status change
    try {
      await notifyKycStatusChange(updated, status);
    } catch (error) {
      console.error('Failed to send KYC notification:', error);
      // We don't fail the request if notification fails
    }

    return c.json({ success: true, user: updated })
  } catch (error) {
    console.error('Error updating user KYC status:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

export default app
