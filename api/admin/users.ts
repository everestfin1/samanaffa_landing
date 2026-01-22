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
    const kycStatus = url.searchParams.get('kycStatus')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where = kycStatus ? { kycStatus: kycStatus.toUpperCase() as any } : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          accounts: true,
          kycDocuments: {
            orderBy: { uploadDate: 'desc' },
            take: 1,
          },
          _count: {
            select: {
              transactionIntents: true,
              kycDocuments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    return res.status(200).json({
      success: true,
      users: users.map((user: any) => ({
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        nationality: user.nationality,
        city: user.city,
        preferredLanguage: user.preferredLanguage,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        kycStatus: user.kycStatus,
        createdAt: user.createdAt,
        accounts: (user.accounts || []).map((account: any) => ({
          id: account.id,
          accountType: account.accountType,
          accountNumber: account.accountNumber,
          balance: account.balance,
          status: account.status,
        })),
        latestKycDocument: (user.kycDocuments || [])[0] || null,
        stats: {
          totalTransactions: user._count?.transactionIntents || 0,
          totalKycDocuments: user._count?.kycDocuments || 0,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
