import { Hono } from 'hono'
import { db, desc, sql, eq } from '../../lib/db.js'
import { apeSponsorCodes } from '../../lib/schema.js'
import { requireAdmin, type AdminVariables } from '../../middleware/auth.js'
import { nanoid } from 'nanoid'

const app = new Hono<{ Variables: AdminVariables }>()

app.use('*', requireAdmin)

app.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const pageSize = parseInt(c.req.query('pageSize') || '20')
    const offset = (page - 1) * pageSize

    const [codes, countResult] = await Promise.all([
      db.select().from(apeSponsorCodes).orderBy(desc(apeSponsorCodes.createdAt)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(apeSponsorCodes)
    ])

    return c.json({
      success: true,
      sponsorCodes: codes,
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
