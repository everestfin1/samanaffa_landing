import { Hono } from 'hono'
import { db, desc, sql, eq, inArray } from '../../lib/db.js'
import { apeSubscriptions } from '../../lib/schema.js'
import { requireAdmin } from '../../middleware/auth.js'

type IntouchTransaction = {
  id: string
  idTransaction: string
  telephone: string
  montant: number
  service?: string
  date: string
  idPartenaireDistributeur: string
  reference?: string
  statut?: string
}

type ReconciliationMatch = {
  apeReferenceNumber: string
  apeId: string
  apeTelephone: string
  apeMontant: number
  intouchMontant: number
  intouchTransactionId: string
  intouchDate: string
  matchType: 'exact' | 'amount_mismatch'
  discrepancy?: number
}

const app = new Hono()

app.use('*', requireAdmin)

app.post('/analyze', async (c) => {
  try {
    const body = await c.req.json()
    const intouchTransactions = (body?.intouchTransactions ?? []) as IntouchTransaction[]

    if (!Array.isArray(intouchTransactions)) {
      return c.json({ success: false, error: 'Invalid request: intouchTransactions array required' }, 400)
    }

    const intouchReferences = intouchTransactions
      .map((t) => t.idPartenaireDistributeur)
      .filter((ref) => typeof ref === 'string' && ref.startsWith('APE-'))

    if (intouchReferences.length === 0) {
      return c.json({
        success: true,
        result: {
          matches: [],
          notFoundInApe: intouchTransactions,
          notFoundInIntouch: [],
          summary: {
            total: intouchTransactions.length,
            exact: 0,
            amountMismatch: 0,
            notFound: intouchTransactions.length,
          },
        },
      })
    }

    const apeSubscriptionsList = await db
      .select()
      .from(apeSubscriptions)
      .where(inArray(apeSubscriptions.referenceNumber, intouchReferences))

    const apeMap = new Map(apeSubscriptionsList.map((sub) => [sub.referenceNumber, sub] as const))

    const matches: ReconciliationMatch[] = []
    const notFoundInApe: IntouchTransaction[] = []

    for (const intouchTx of intouchTransactions) {
      const apeRef = intouchTx.idPartenaireDistributeur
      const apeSub = apeMap.get(apeRef)

      if (!apeSub) {
        notFoundInApe.push(intouchTx)
        continue
      }

      const apeMontant = Number(apeSub.montantCfa)
      const intouchMontant = Number(intouchTx.montant)
      const discrepancy = Math.abs(apeMontant - intouchMontant)

      matches.push({
        apeReferenceNumber: apeSub.referenceNumber,
        apeId: apeSub.id,
        apeTelephone: apeSub.telephone,
        apeMontant,
        intouchMontant,
        intouchTransactionId: intouchTx.idTransaction,
        intouchDate: intouchTx.date,
        matchType: discrepancy < 0.01 ? 'exact' : 'amount_mismatch',
        discrepancy: discrepancy >= 0.01 ? discrepancy : undefined,
      })
    }

    const intouchRefSet = new Set(intouchReferences)
    const notFoundInIntouch = apeSubscriptionsList
      .filter((sub) => !intouchRefSet.has(sub.referenceNumber))
      .map((sub) => sub.referenceNumber)

    const result = {
      matches,
      notFoundInApe,
      notFoundInIntouch,
      summary: {
        total: intouchTransactions.length,
        exact: matches.filter((m) => m.matchType === 'exact').length,
        amountMismatch: matches.filter((m) => m.matchType === 'amount_mismatch').length,
        notFound: notFoundInApe.length,
      },
    }

    return c.json({ success: true, result })
  } catch (error) {
    console.error('[Reconciliation] Error:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.patch('/apply', async (c) => {
  try {
    const body = await c.req.json()
    const matches = (body?.matches ?? []) as ReconciliationMatch[]

    if (!Array.isArray(matches)) {
      return c.json({ success: false, error: 'Invalid request: matches array required' }, 400)
    }

    const updates = []

    for (const match of matches) {
      const updateData: Record<string, unknown> = {
        status: 'PAYMENT_SUCCESS',
        providerTransactionId: match.intouchTransactionId,
        paymentCompletedAt: new Date(match.intouchDate),
        updatedAt: new Date(),
        paymentCallbackPayload: {
          reconciliationType: 'manual_csv_import',
          reconciledAt: new Date().toISOString(),
          intouchTransactionId: match.intouchTransactionId,
          intouchDate: match.intouchDate,
          intouchMontant: match.intouchMontant,
          matchType: match.matchType,
          discrepancy: match.discrepancy,
        },
      }

      const [updated] = await db
        .update(apeSubscriptions)
        .set(updateData)
        .where(eq(apeSubscriptions.id, match.apeId))
        .returning()

      if (updated) updates.push(updated)
    }

    return c.json({ success: true, updated: updates.length, subscriptions: updates })
  } catch (error) {
    console.error('[Reconciliation] Error applying updates:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

app.get('/history', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const pageSize = parseInt(c.req.query('pageSize') || '20')
    const offset = (page - 1) * pageSize

    const whereClause = eq(apeSubscriptions.status, 'PAYMENT_SUCCESS')

    const [items, countResult] = await Promise.all([
      db
        .select({
          id: apeSubscriptions.id,
          referenceNumber: apeSubscriptions.referenceNumber,
          providerTransactionId: apeSubscriptions.providerTransactionId,
          montantCfa: apeSubscriptions.montantCfa,
          paymentCompletedAt: apeSubscriptions.paymentCompletedAt,
          updatedAt: apeSubscriptions.updatedAt,
        })
        .from(apeSubscriptions)
        .where(whereClause)
        .orderBy(desc(apeSubscriptions.updatedAt))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(apeSubscriptions)
        .where(whereClause),
    ])

    return c.json({
      success: true,
      items,
      pagination: {
        page,
        pageSize,
        total: Number(countResult[0]?.count ?? 0),
        totalPages: Math.ceil(Number(countResult[0]?.count ?? 0) / pageSize),
      },
    })
  } catch (error) {
    console.error('[Reconciliation] Error fetching history:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

export default app
