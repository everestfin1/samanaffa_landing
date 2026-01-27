import { Hono } from 'hono'
import { db, desc, asc, sql, eq, and, or, like, gte, lte } from '../../lib/db.js'
import { apeSponsorCodes } from '../../lib/schema.js'
import { requireAdmin, type AdminVariables } from '../../middleware/auth.js'
import { nanoid } from 'nanoid'

const app = new Hono<{ Variables: AdminVariables }>()

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
          like(sql`lower(${apeSponsorCodes.code})`, searchTerm),
          like(sql`lower(coalesce(${apeSponsorCodes.description}, ''))`, searchTerm)
        )
      )
    }

    if (status) {
      conditions.push(like(sql`lower(${apeSponsorCodes.status}::text)`, `%${status.toLowerCase()}%`))
    }

    if (date) {
      const startOfDay = new Date(date)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      conditions.push(and(gte(apeSponsorCodes.createdAt, startOfDay), lte(apeSponsorCodes.createdAt, endOfDay)))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const sortColumn =
      sortBy === 'code'
        ? apeSponsorCodes.code
        : sortBy === 'status'
          ? apeSponsorCodes.status
          : sortBy === 'usageCount'
            ? apeSponsorCodes.usageCount
            : apeSponsorCodes.createdAt
    const orderFn = sortOrder === 'asc' ? asc : desc

    const [codes, countResult, statsResult, usageResult] = await Promise.all([
      db.select().from(apeSponsorCodes).where(whereClause).orderBy(orderFn(sortColumn)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(apeSponsorCodes).where(whereClause),
      db
        .select({
          status: apeSponsorCodes.status,
          count: sql<number>`count(*)`,
        })
        .from(apeSponsorCodes)
        .where(whereClause)
        .groupBy(apeSponsorCodes.status),
      db
        .select({
          totalUsage: sql<number>`coalesce(sum(${apeSponsorCodes.usageCount}), 0)`,
        })
        .from(apeSponsorCodes)
        .where(whereClause),
    ])

    const stats = {
      total: Number(countResult[0]?.count ?? 0),
      active: 0,
      inactive: 0,
      expired: 0,
      totalUsage: Number(usageResult[0]?.totalUsage ?? 0),
    }

    for (const row of statsResult) {
      const key = String(row.status).toLowerCase() as keyof typeof stats
      if (key in stats) {
        ;(stats as any)[key] = Number(row.count)
      }
    }

    return c.json({
      success: true,
      sponsorCodes: codes,
      stats,
      pagination: {
        page,
        pageSize,
        total: Number(countResult[0].count),
        totalPages: Math.ceil(Number(countResult[0].count) / pageSize)
      }
    })
  } catch (error) {
    console.error('Error fetching sponsor codes:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { code, description, maxUsage, expiresAt } = body
    const adminId = c.get('adminId')

    const newCode = await db.insert(apeSponsorCodes).values({
      id: nanoid(),
      code: code || nanoid(8).toUpperCase(),
      description,
      createdBy: adminId,
      maxUsage,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    }).returning()

    return c.json({ success: true, sponsorCode: newCode[0] })
  } catch (error) {
    console.error('Error creating sponsor code:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { status, description, maxUsage, expiresAt } = body

    const [updated] = await db.update(apeSponsorCodes)
      .set({ 
        status, 
        description, 
        maxUsage,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        updatedAt: new Date()
      })
      .where(eq(apeSponsorCodes.id, id))
      .returning()
    
    if (!updated) {
      return c.json({ success: false, error: 'Sponsor code not found' }, 404)
    }
    
    return c.json({ success: true, sponsorCode: updated })
  } catch (error) {
    console.error('Error updating sponsor code:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

export default app
