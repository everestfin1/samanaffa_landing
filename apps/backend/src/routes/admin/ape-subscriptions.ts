import { Hono } from 'hono'
import { db, desc, sql, eq } from '../../lib/db.js'
import { apeSubscriptions, apeSponsorCodes } from '../../lib/schema.js'
import { requireAdmin, type AdminVariables } from '../../middleware/auth.js'

type Env = { Variables: AdminVariables }

const app = new Hono<Env>()

app.use('*', requireAdmin)

app.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const pageSize = parseInt(c.req.query('pageSize') || '20')
    const offset = (page - 1) * pageSize

    const [subscriptions, countResult] = await Promise.all([
      db.select().from(apeSubscriptions).orderBy(desc(apeSubscriptions.createdAt)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(apeSubscriptions)
    ])

    return c.json({
      success: true,
      subscriptions,
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
