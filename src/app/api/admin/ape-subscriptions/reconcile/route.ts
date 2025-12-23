import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { apeSubscriptions } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'

interface IntouchTransaction {
  id: string
  idTransaction: string
  telephone: string
  montant: number
  service: string
  date: string
  idPartenaireDistributeur: string
  reference: string
  statut: string
}

interface ReconciliationMatch {
  apeReferenceNumber: string
  apeId: string
  apeTelephone: string
  apeMontant: number
  intouchMontant: number
  intouchTransactionId: string
  intouchDate: string
  matchType: 'exact' | 'amount_mismatch' | 'not_found'
  discrepancy?: number
}

async function verifyAdminToken(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return false
  }
  const token = authHeader.substring(7)
  return token.length > 0
}

// POST - Analyze Intouch CSV and match with APE subscriptions
export async function POST(request: NextRequest) {
  try {
    const isAuthorized = await verifyAdminToken(request)
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { intouchTransactions } = body as { intouchTransactions: IntouchTransaction[] }

    if (!intouchTransactions || !Array.isArray(intouchTransactions)) {
      return NextResponse.json(
        { error: 'Invalid request: intouchTransactions array required' },
        { status: 400 }
      )
    }

    console.log(`[Reconciliation] Processing ${intouchTransactions.length} Intouch transactions`)

    // Extract reference numbers from Intouch data
    const intouchReferences = intouchTransactions
      .map(t => t.idPartenaireDistributeur)
      .filter(ref => ref && ref.startsWith('APE-'))

    // Fetch matching APE subscriptions
    const apeSubscriptionsList = await db
      .select()
      .from(apeSubscriptions)
      .where(inArray(apeSubscriptions.referenceNumber, intouchReferences))

    console.log(`[Reconciliation] Found ${apeSubscriptionsList.length} matching APE subscriptions`)

    // Create a map for quick lookup
    const apeMap = new Map(
      apeSubscriptionsList.map(sub => [sub.referenceNumber, sub])
    )

    const matches: ReconciliationMatch[] = []
    const notFoundInApe: IntouchTransaction[] = []

    // Match Intouch transactions with APE subscriptions
    for (const intouchTx of intouchTransactions) {
      const apeRef = intouchTx.idPartenaireDistributeur
      const apeSub = apeMap.get(apeRef)

      if (!apeSub) {
        notFoundInApe.push(intouchTx)
        continue
      }

      const apeMontant = parseFloat(apeSub.montantCfa)
      const intouchMontant = intouchTx.montant
      const discrepancy = Math.abs(apeMontant - intouchMontant)

      const match: ReconciliationMatch = {
        apeReferenceNumber: apeSub.referenceNumber,
        apeId: apeSub.id,
        apeTelephone: apeSub.telephone,
        apeMontant,
        intouchMontant,
        intouchTransactionId: intouchTx.idTransaction,
        intouchDate: intouchTx.date,
        matchType: discrepancy < 0.01 ? 'exact' : 'amount_mismatch',
        discrepancy: discrepancy >= 0.01 ? discrepancy : undefined,
      }

      matches.push(match)
    }

    // Find APE subscriptions not in Intouch (PAYMENT_INITIATED but not paid)
    const intouchRefSet = new Set(intouchReferences)
    const notFoundInIntouch = apeSubscriptionsList
      .filter(sub => !intouchRefSet.has(sub.referenceNumber))
      .map(sub => sub.referenceNumber)

    const result = {
      matches,
      notFoundInApe,
      notFoundInIntouch,
      summary: {
        total: intouchTransactions.length,
        exact: matches.filter(m => m.matchType === 'exact').length,
        amountMismatch: matches.filter(m => m.matchType === 'amount_mismatch').length,
        notFound: notFoundInApe.length,
      },
    }

    console.log('[Reconciliation] Summary:', result.summary)

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error('[Reconciliation] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Apply reconciliation (bulk update matched subscriptions)
export async function PATCH(request: NextRequest) {
  try {
    const isAuthorized = await verifyAdminToken(request)
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { matches } = body as { matches: ReconciliationMatch[] }

    if (!matches || !Array.isArray(matches)) {
      return NextResponse.json(
        { error: 'Invalid request: matches array required' },
        { status: 400 }
      )
    }

    console.log(`[Reconciliation] Applying reconciliation for ${matches.length} subscriptions`)

    const updates: any[] = []

    for (const match of matches) {
      const updateData = {
        status: 'PAYMENT_SUCCESS' as const,
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
        } as any,
      }

      const [updated] = await db
        .update(apeSubscriptions)
        .set(updateData)
        .where(eq(apeSubscriptions.id, match.apeId))
        .returning()

      if (updated) {
        updates.push(updated)
      }
    }

    console.log(`[Reconciliation] Successfully updated ${updates.length} subscriptions`)

    return NextResponse.json({
      success: true,
      updated: updates.length,
      subscriptions: updates,
    })
  } catch (error) {
    console.error('[Reconciliation] Error applying updates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
