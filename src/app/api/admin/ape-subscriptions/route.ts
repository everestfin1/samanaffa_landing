import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  // Verify admin authentication
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
    const format = searchParams.get('format'); // 'csv' or 'xlsx' for export

    const where = status ? { status: status.toUpperCase() as any } : {};

    const [subscriptions, total] = await Promise.all([
      prisma.apeSubscription.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.apeSubscription.count({ where })
    ]);

    // Calculate stats
    const [
      totalSubscriptions,
      pendingCount,
      paymentInitiatedCount,
      paymentSuccessCount,
      paymentFailedCount,
      cancelledCount
    ] = await Promise.all([
      prisma.apeSubscription.count(),
      prisma.apeSubscription.count({ where: { status: 'PENDING' } }),
      prisma.apeSubscription.count({ where: { status: 'PAYMENT_INITIATED' } }),
      prisma.apeSubscription.count({ where: { status: 'PAYMENT_SUCCESS' } }),
      prisma.apeSubscription.count({ where: { status: 'PAYMENT_FAILED' } }),
      prisma.apeSubscription.count({ where: { status: 'CANCELLED' } }),
    ]);

    // Calculate total amount from successful payments
    const successfulSubscriptions = await prisma.apeSubscription.findMany({
      where: { status: 'PAYMENT_SUCCESS' }
    });
    const totalAmount = successfulSubscriptions.reduce((sum, sub) => {
      return sum + parseFloat(sub.montantCfa?.toString() || '0');
    }, 0);

    // If export format is requested, return data for export
    if (format === 'csv' || format === 'xlsx') {
      // Fetch all subscriptions for export (no pagination)
      const allSubscriptions = await prisma.apeSubscription.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({
        success: true,
        subscriptions: allSubscriptions.map(sub => ({
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
        })),
        format,
      });
    }

    return NextResponse.json({
      success: true,
      subscriptions: subscriptions.map(sub => ({
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
        total: totalSubscriptions,
        pending: pendingCount,
        paymentInitiated: paymentInitiatedCount,
        paymentSuccess: paymentSuccessCount,
        paymentFailed: paymentFailedCount,
        cancelled: cancelledCount,
        totalAmount,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching APE subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
