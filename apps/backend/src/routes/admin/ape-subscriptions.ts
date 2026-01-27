import { Hono } from 'hono'
import { db, desc, asc, sql, eq, and, or, like, gte, lte } from '../../lib/db.js'
import { apeSubscriptions, apeSponsorCodes, adminAuditLogs } from '../../lib/schema.js'
import { requireAdmin, type AdminVariables } from '../../middleware/auth.js'

type Env = { Variables: AdminVariables }

const app = new Hono<Env>()

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
          like(sql`lower(${apeSubscriptions.referenceNumber})`, searchTerm),
          like(sql`lower(${apeSubscriptions.prenom})`, searchTerm),
          like(sql`lower(${apeSubscriptions.nom})`, searchTerm),
          like(sql`lower(${apeSubscriptions.email})`, searchTerm),
          like(sql`lower(${apeSubscriptions.telephone})`, searchTerm)
        )
      )
    }

    if (status) {
      conditions.push(like(sql`lower(${apeSubscriptions.status}::text)`, `%${status.toLowerCase()}%`))
    }

    if (date) {
      const startOfDay = new Date(date)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      conditions.push(and(gte(apeSubscriptions.createdAt, startOfDay), lte(apeSubscriptions.createdAt, endOfDay)))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const sortColumn =
      sortBy === 'amount'
        ? apeSubscriptions.montantCfa
        : sortBy === 'status'
          ? apeSubscriptions.status
          : sortBy === 'referenceNumber'
            ? apeSubscriptions.referenceNumber
            : apeSubscriptions.createdAt
    const orderFn = sortOrder === 'asc' ? asc : desc

    const [subscriptions, countResult, statsResult, volumeResult] = await Promise.all([
      db
        .select()
        .from(apeSubscriptions)
        .where(whereClause)
        .orderBy(orderFn(sortColumn))
        .limit(pageSize)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(apeSubscriptions).where(whereClause),
      db
        .select({
          status: apeSubscriptions.status,
          count: sql<number>`count(*)`,
        })
        .from(apeSubscriptions)
        .where(whereClause)
        .groupBy(apeSubscriptions.status),
      db
        .select({
          totalVolume: sql<number>`coalesce(sum(${apeSubscriptions.montantCfa}::numeric), 0)`,
        })
        .from(apeSubscriptions)
        .where(whereClause),
    ])

    const stats = {
      total: Number(countResult[0]?.count ?? 0),
      pending: 0,
      payment_initiated: 0,
      payment_success: 0,
      payment_failed: 0,
      cancelled: 0,
      totalVolume: Number(volumeResult[0]?.totalVolume ?? 0),
    }

    for (const row of statsResult) {
      const key = String(row.status).toLowerCase() as keyof typeof stats
      if (key in stats) {
        ;(stats as any)[key] = Number(row.count)
      }
    }

    return c.json({
      success: true,
      subscriptions,
      stats,
      pagination: {
        page,
        pageSize,
        total: Number(countResult[0].count),
        totalPages: Math.ceil(Number(countResult[0].count) / pageSize)
      }
    })
  } catch (error) {
    console.error('Error fetching APE subscriptions:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.get('/sponsor-codes', async (c) => {
  try {
    const codes = await db.select().from(apeSponsorCodes).orderBy(desc(apeSponsorCodes.createdAt))
    return c.json({ success: true, codes })
  } catch (error) {
    console.error('Error fetching sponsor codes:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const adminId = c.get('adminId')
    const body = await c.req.json()

    const { status, providerTransactionId, adminNotes } = body ?? {}

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    }

    if (status) updateData.status = status
    if (providerTransactionId !== undefined) updateData.providerTransactionId = providerTransactionId
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes

    const [updated] = await db
      .update(apeSubscriptions)
      .set(updateData)
      .where(eq(apeSubscriptions.id, id))
      .returning()

    if (!updated) {
      return c.json({ success: false, error: 'Subscription not found' }, 404)
    }

    await db.insert(adminAuditLogs).values({
      id: crypto.randomUUID(),
      adminId,
      action: 'APE_SUBSCRIPTION_MANUAL_UPDATE',
      resourceType: 'ape_subscription',
      resourceId: id,
      details: {
        status,
        providerTransactionId,
        adminNotes,
      },
      ipAddress: c.req.header('x-forwarded-for') ?? null,
      userAgent: c.req.header('user-agent') ?? null,
    })

    return c.json({ success: true, subscription: updated })
  } catch (error) {
    console.error('Error updating APE subscription:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.post('/sponsor-codes', async (c) => {
  try {
    const adminId = c.get('adminId')
    const { code, description, maxUsage, expiresAt } = await c.req.json()

    if (!code) {
      return c.json({ success: false, error: 'Code is required' }, 400)
    }

    const newCode = await db.insert(apeSponsorCodes).values({
      id: crypto.randomUUID(),
      code: code.toUpperCase(),
      description,
      createdBy: adminId,
      maxUsage,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    }).returning()

    return c.json({ success: true, code: newCode[0] })
  } catch (error) {
    console.error('Error creating sponsor code:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.put('/sponsor-codes/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()

    const updated = await db.update(apeSponsorCodes)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(apeSponsorCodes.id, id))
      .returning()

    if (!updated[0]) {
      return c.json({ success: false, error: 'Sponsor code not found' }, 404)
    }

    return c.json({ success: true, code: updated[0] })
  } catch (error) {
    console.error('Error updating sponsor code:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

export default app
