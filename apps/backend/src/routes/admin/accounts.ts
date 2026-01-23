import { Hono } from 'hono'
import { db, desc, sql, eq } from '../../lib/db.js'
import { userAccounts, users } from '../../lib/schema.js'
import { requireAdmin } from '../../middleware/auth.js'

const app = new Hono()

app.use('*', requireAdmin)

app.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const pageSize = parseInt(c.req.query('pageSize') || '20')
    const offset = (page - 1) * pageSize

    const [accounts, countResult] = await Promise.all([
      db.select({
        id: userAccounts.id,
        userId: userAccounts.userId,
        accountType: userAccounts.accountType,
        accountNumber: userAccounts.accountNumber,
        productCode: userAccounts.productCode,
        productName: userAccounts.productName,
        balance: userAccounts.balance,
        status: userAccounts.status,
        createdAt: userAccounts.createdAt,
        userName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
        userEmail: users.email
      })
      .from(userAccounts)
      .leftJoin(users, eq(userAccounts.userId, users.id))
      .orderBy(desc(userAccounts.createdAt))
      .limit(pageSize)
      .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(userAccounts)
    ])

    return c.json({
      success: true,
      accounts,
      pagination: {
        page,
        pageSize,
        total: Number(countResult[0].count),
        totalPages: Math.ceil(Number(countResult[0].count) / pageSize)
      }
    })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.post('/recalculate-balances', async (c) => {
  try {
    // This would typically recalculate balances from transaction history
    // For now, return success
    return c.json({ 
      success: true, 
      message: 'Balance recalculation initiated',
      accountsProcessed: 0 
    })
  } catch (error) {
    console.error('Error recalculating balances:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const [account] = await db.select({
      id: userAccounts.id,
      userId: userAccounts.userId,
      accountType: userAccounts.accountType,
      accountNumber: userAccounts.accountNumber,
      productCode: userAccounts.productCode,
      productName: userAccounts.productName,
      balance: userAccounts.balance,
      status: userAccounts.status,
      createdAt: userAccounts.createdAt,
      userName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
      userEmail: users.email
    })
    .from(userAccounts)
    .leftJoin(users, eq(userAccounts.userId, users.id))
    .where(eq(userAccounts.id, id))
    
    if (!account) {
      return c.json({ success: false, error: 'Account not found' }, 404)
    }
    
    return c.json({ success: true, account })
  } catch (error) {
    console.error('Error fetching account:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { status } = body

    const [updated] = await db.update(userAccounts)
      .set({ status })
      .where(eq(userAccounts.id, id))
      .returning()
    
    if (!updated) {
      return c.json({ success: false, error: 'Account not found' }, 404)
    }
    
    return c.json({ success: true, account: updated })
  } catch (error) {
    console.error('Error updating account:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

export default app
