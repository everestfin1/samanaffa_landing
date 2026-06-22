import { NextRequest, NextResponse } from 'next/server';
import { count, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { apeSubscriptions } from '@/lib/db/schema';
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth';

type ApeSubscriptionStatus = typeof apeSubscriptions.status.enumValues[number];

function mapSubscriptionForExport(sub: typeof apeSubscriptions.$inferSelect) {
  return {
    id: sub.id,
    referenceNumber: sub.referenceNumber,
    civilite: sub.civilite,
    prenom: sub.prenom,
    nom: sub.nom,
    email: sub.email,
    telephone: sub.telephone,
    paysResidence: sub.paysResidence,
    ville: sub.ville,
    categorieSocioprofessionnelle: sub.categorieSocioprofessionnelle,
    trancheInteresse: sub.trancheInteresse,
    montantCfa: sub.montantCfa,
    codeParrainage: sub.codeParrainage || '',
    status: sub.status,
    providerTransactionId: sub.providerTransactionId || '',
    providerStatus: sub.providerStatus || '',
    paymentInitiatedAt: sub.paymentInitiatedAt?.toISOString() || '',
    paymentCompletedAt: sub.paymentCompletedAt?.toISOString() || '',
    createdAt: sub.createdAt.toISOString(),
    updatedAt: sub.updatedAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;
    const format = searchParams.get('format');

    const whereClause = status
      ? eq(apeSubscriptions.status, status.toUpperCase() as ApeSubscriptionStatus)
      : undefined;

    if (format === 'csv' || format === 'xlsx') {
      const allSubscriptions = await db
        .select()
        .from(apeSubscriptions)
        .where(whereClause)
        .orderBy(desc(apeSubscriptions.createdAt));

      return NextResponse.json({
        success: true,
        subscriptions: allSubscriptions.map(mapSubscriptionForExport),
        format,
      });
    }

    const [subscriptions, totalResult, statsResult, successfulSubs] = await Promise.all([
      db
        .select()
        .from(apeSubscriptions)
        .where(whereClause)
        .orderBy(desc(apeSubscriptions.createdAt))
        .limit(limit)
        .offset(skip),
      db
        .select({ total: count() })
        .from(apeSubscriptions)
        .where(whereClause),
      db
        .select({
          total: sql<number>`count(*)`,
          pending: sql<number>`count(*) filter (where ${apeSubscriptions.status} = 'PENDING')`,
          paymentInitiated: sql<number>`count(*) filter (where ${apeSubscriptions.status} = 'PAYMENT_INITIATED')`,
          paymentSuccess: sql<number>`count(*) filter (where ${apeSubscriptions.status} = 'PAYMENT_SUCCESS')`,
          paymentFailed: sql<number>`count(*) filter (where ${apeSubscriptions.status} = 'PAYMENT_FAILED')`,
          cancelled: sql<number>`count(*) filter (where ${apeSubscriptions.status} = 'CANCELLED')`,
        })
        .from(apeSubscriptions),
      db
        .select({ montantCfa: apeSubscriptions.montantCfa })
        .from(apeSubscriptions)
        .where(eq(apeSubscriptions.status, 'PAYMENT_SUCCESS')),
    ]);

    const total = Number(totalResult[0]?.total ?? 0);
    const totalAmount = successfulSubs.reduce((sum, sub) => {
      return sum + parseFloat(sub.montantCfa?.toString() || '0');
    }, 0);

    return NextResponse.json({
      success: true,
      subscriptions: subscriptions.map((sub) => ({
        id: sub.id,
        referenceNumber: sub.referenceNumber,
        civilite: sub.civilite,
        prenom: sub.prenom,
        nom: sub.nom,
        email: sub.email,
        telephone: sub.telephone,
        paysResidence: sub.paysResidence,
        ville: sub.ville,
        categorieSocioprofessionnelle: sub.categorieSocioprofessionnelle,
        trancheInteresse: sub.trancheInteresse,
        montantCfa: sub.montantCfa,
        codeParrainage: sub.codeParrainage,
        status: sub.status,
        providerTransactionId: sub.providerTransactionId,
        providerStatus: sub.providerStatus,
        paymentInitiatedAt: sub.paymentInitiatedAt,
        paymentCompletedAt: sub.paymentCompletedAt,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
      })),
      stats: {
        total: Number(statsResult[0]?.total ?? 0),
        pending: Number(statsResult[0]?.pending ?? 0),
        paymentInitiated: Number(statsResult[0]?.paymentInitiated ?? 0),
        paymentSuccess: Number(statsResult[0]?.paymentSuccess ?? 0),
        paymentFailed: Number(statsResult[0]?.paymentFailed ?? 0),
        cancelled: Number(statsResult[0]?.cancelled ?? 0),
        totalAmount,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching APE subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
