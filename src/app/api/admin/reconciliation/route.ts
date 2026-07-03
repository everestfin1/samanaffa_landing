import { NextRequest, NextResponse } from 'next/server';
import { and, eq, gte, inArray, lte, ne } from 'drizzle-orm';
import { db } from '@/lib/db';
import { transactionIntents, users } from '@/lib/db/schema';
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth';

interface IntouchTransaction {
  id: string;
  idTransaction: string;
  telephone: string;
  montant: number;
  service: string;
  date: string;
  idPartenaireDistributeur: string;
  reference: string;
  statut: string;
}

interface ReconciliationMatch {
  referenceNumber: string;
  intentId: string;
  phone: string;
  dbAmount: number;
  dbStatus: string;
  intouchAmount: number;
  intouchTransactionId: string;
  intouchDate: string;
  matchType: 'exact' | 'amount_mismatch' | 'callback_missing';
  discrepancy?: number;
}

interface PendingIntent {
  referenceNumber: string;
  intentId: string;
  phone: string;
  amount: number;
  status: string;
  createdAt: Date;
}

/** Sama Naffa deposit references (SN-DEP-…) only. */
function isSamaNaffaReference(ref: string | null | undefined): boolean {
  return !!ref && ref.startsWith('SN-');
}

/**
 * POST — reconcile Intouch payments against Sama Naffa transaction intents.
 * Two modes:
 *  - CSV:        { intouchTransactions: IntouchTransaction[] }
 *  - Date range: { dateFrom: string, dateTo: string }  → surfaces non-terminal intents
 */
export async function POST(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);
  if (error || !user) return createErrorResponse('Unauthorized', 401);

  try {
    const body = await request.json();
    const { intouchTransactions, dateFrom, dateTo } = body as {
      intouchTransactions?: IntouchTransaction[];
      dateFrom?: string;
      dateTo?: string;
    };

    // --- Date-range scan mode ---
    if (!intouchTransactions && (dateFrom || dateTo)) {
      const conditions = [ne(transactionIntents.status, 'COMPLETED')];
      if (dateFrom) conditions.push(gte(transactionIntents.createdAt, new Date(dateFrom)));
      if (dateTo) conditions.push(lte(transactionIntents.createdAt, new Date(dateTo)));

      const rows = await db
        .select({
          intentId: transactionIntents.id,
          referenceNumber: transactionIntents.referenceNumber,
          amount: transactionIntents.amount,
          status: transactionIntents.status,
          createdAt: transactionIntents.createdAt,
          phone: users.phone,
        })
        .from(transactionIntents)
        .innerJoin(users, eq(transactionIntents.userId, users.id))
        .where(and(...conditions));

      const pendingInDb: PendingIntent[] = rows
        .filter((r) => isSamaNaffaReference(r.referenceNumber))
        .map((r) => ({
          referenceNumber: r.referenceNumber,
          intentId: r.intentId,
          phone: r.phone,
          amount: parseFloat(r.amount),
          status: r.status,
          createdAt: r.createdAt,
        }));

      return NextResponse.json({
        success: true,
        result: {
          matches: [],
          notFoundInDb: [],
          pendingInDb,
          summary: {
            total: pendingInDb.length,
            exact: 0,
            amountMismatch: 0,
            callbackMissing: 0,
            notFoundInDb: 0,
            pendingInDb: pendingInDb.length,
          },
        },
      });
    }

    // --- CSV mode ---
    if (!intouchTransactions || !Array.isArray(intouchTransactions)) {
      return NextResponse.json(
        { error: 'Invalid request: intouchTransactions array or dateFrom/dateTo required' },
        { status: 400 },
      );
    }

    const references = intouchTransactions
      .map((t) => t.idPartenaireDistributeur)
      .filter(isSamaNaffaReference);

    const intents = references.length
      ? await db
          .select({
            intentId: transactionIntents.id,
            referenceNumber: transactionIntents.referenceNumber,
            amount: transactionIntents.amount,
            status: transactionIntents.status,
            phone: users.phone,
          })
          .from(transactionIntents)
          .innerJoin(users, eq(transactionIntents.userId, users.id))
          .where(inArray(transactionIntents.referenceNumber, references))
      : [];

    const intentMap = new Map(intents.map((i) => [i.referenceNumber, i]));

    const matches: ReconciliationMatch[] = [];
    const notFoundInDb: IntouchTransaction[] = [];

    for (const tx of intouchTransactions) {
      const ref = tx.idPartenaireDistributeur;
      if (!isSamaNaffaReference(ref)) continue;
      const intent = intentMap.get(ref);
      if (!intent) {
        notFoundInDb.push(tx);
        continue;
      }

      const dbAmount = parseFloat(intent.amount);
      const discrepancy = Math.abs(dbAmount - tx.montant);
      const amountOk = discrepancy < 0.01;

      matches.push({
        referenceNumber: intent.referenceNumber,
        intentId: intent.intentId,
        phone: intent.phone,
        dbAmount,
        dbStatus: intent.status,
        intouchAmount: tx.montant,
        intouchTransactionId: tx.idTransaction,
        intouchDate: tx.date,
        matchType: !amountOk
          ? 'amount_mismatch'
          : intent.status === 'COMPLETED'
            ? 'exact'
            : 'callback_missing',
        discrepancy: amountOk ? undefined : discrepancy,
      });
    }

    return NextResponse.json({
      success: true,
      result: {
        matches,
        notFoundInDb,
        pendingInDb: [],
        summary: {
          total: intouchTransactions.length,
          exact: matches.filter((m) => m.matchType === 'exact').length,
          amountMismatch: matches.filter((m) => m.matchType === 'amount_mismatch').length,
          callbackMissing: matches.filter((m) => m.matchType === 'callback_missing').length,
          notFoundInDb: notFoundInDb.length,
          pendingInDb: 0,
        },
      },
    });
  } catch (err) {
    console.error('[SN Reconciliation] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/** PATCH — confirm selected intents as COMPLETED from reconciliation. */
export async function PATCH(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);
  if (error || !user) return createErrorResponse('Unauthorized', 401);

  try {
    const body = await request.json();
    const { matches } = body as { matches: ReconciliationMatch[] };

    if (!matches || !Array.isArray(matches)) {
      return NextResponse.json({ error: 'Invalid request: matches array required' }, { status: 400 });
    }

    let updated = 0;
    for (const match of matches) {
      const [row] = await db
        .update(transactionIntents)
        .set({
          status: 'COMPLETED',
          providerTransactionId: match.intouchTransactionId,
          providerStatus: 'RECONCILED',
          lastCallbackAt: new Date(),
          awaitingKycApproval: false,
          adminNotes: `Réconcilié manuellement par ${user.email} le ${new Date().toISOString()}`,
          lastCallbackPayload: {
            reconciliationType: 'manual_intouch_import',
            reconciledAt: new Date().toISOString(),
            reconciledBy: user.email,
            intouchTransactionId: match.intouchTransactionId,
            intouchDate: match.intouchDate,
            intouchAmount: match.intouchAmount,
            matchType: match.matchType,
            discrepancy: match.discrepancy,
          },
          updatedAt: new Date(),
        })
        .where(eq(transactionIntents.id, match.intentId))
        .returning({ id: transactionIntents.id });
      if (row) updated += 1;
    }

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error('[SN Reconciliation] Error applying updates:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
