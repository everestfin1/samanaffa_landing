import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_db'
import { requireAdmin } from './_requireAdmin'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const admin = await requireAdmin(req)
  if (!admin) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  try {
    const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`)
    const status = url.searchParams.get('status')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const skip = (page - 1) * limit
    const format = url.searchParams.get('format')

    const where = status ? { status: status.toUpperCase() as any } : {}

    const [subscriptions, total] = await Promise.all([
      prisma.apeSubscription.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.apeSubscription.count({ where }),
    ])

    const [
      totalSubscriptions,
      pendingCount,
      paymentInitiatedCount,
      paymentSuccessCount,
      paymentFailedCount,
      cancelledCount,
    ] = await Promise.all([
      prisma.apeSubscription.count(),
      prisma.apeSubscription.count({ where: { status: 'PENDING' } }),
      prisma.apeSubscription.count({ where: { status: 'PAYMENT_INITIATED' } }),
      prisma.apeSubscription.count({ where: { status: 'PAYMENT_SUCCESS' } }),
      prisma.apeSubscription.count({ where: { status: 'PAYMENT_FAILED' } }),
      prisma.apeSubscription.count({ where: { status: 'CANCELLED' } }),
    ])

    const successfulSubscriptions = await prisma.apeSubscription.findMany({
      where: { status: 'PAYMENT_SUCCESS' },
    })

    const totalAmount = successfulSubscriptions.reduce((sum, sub) => {
      return sum + parseFloat(sub.montantCfa?.toString() || '0')
    }, 0)

    if (format === 'csv' || format === 'xlsx') {
      const allSubscriptions = await prisma.apeSubscription.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      })

      return res.status(200).json({
        success: true,
        subscriptions: allSubscriptions.map((sub) => ({
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
      })
    }

    return res.status(200).json({
      success: true,
      subscriptions,
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
      },
    })
  } catch (error) {
    console.error('Error fetching APE subscriptions:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
