import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'
import { prisma } from '../_db'

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-in-production'

async function requireAdmin(req: VercelRequest): Promise<{ adminId: string } | null> {
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return null

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as { adminId: string }
    const admin = await prisma.adminUser.findUnique({ where: { id: decoded.adminId } })
    if (!admin || !admin.isActive) return null
    return { adminId: admin.id }
  } catch {
    return null
  }
}

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
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where = status ? { status: status.toUpperCase() as any } : {}

    const [transactionIntents, total] = await Promise.all([
      prisma.transactionIntent.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          account: {
            select: {
              accountNumber: true,
              accountType: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transactionIntent.count({ where }),
    ])

    return res.status(200).json({
      success: true,
      transactionIntents: transactionIntents.map((intent: any) => ({
        id: intent.id,
        referenceNumber: intent.referenceNumber,
        user: {
          id: intent.user.id,
          name: `${intent.user.firstName} ${intent.user.lastName}`,
          email: intent.user.email,
          phone: intent.user.phone,
        },
        account: {
          accountNumber: intent.account.accountNumber,
          accountType: intent.account.accountType,
        },
        intentType: intent.intentType,
        amount: intent.amount,
        paymentMethod: intent.paymentMethod,
        investmentTranche: intent.investmentTranche,
        investmentTerm: intent.investmentTerm,
        userNotes: intent.userNotes,
        adminNotes: intent.adminNotes,
        status: intent.status,
        createdAt: intent.createdAt,
        updatedAt: intent.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching transaction intents:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
