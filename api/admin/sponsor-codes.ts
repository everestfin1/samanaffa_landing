import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_db'
import { requireAdmin } from './_requireAdmin'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = await requireAdmin(req)
  if (!admin) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  try {
    if (req.method === 'GET') {
      const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`)
      const status = url.searchParams.get('status')
      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '50')
      const skip = (page - 1) * limit

      const where = status ? { status: status.toUpperCase() as any } : {}

      const [codes, total] = await Promise.all([
        prisma.apeSponsorCode.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: { createdByAdmin: true },
        }),
        prisma.apeSponsorCode.count({ where }),
      ])

      const [totalCodes, activeCodes, inactiveCodes, expiredCodes] = await Promise.all([
        prisma.apeSponsorCode.count(),
        prisma.apeSponsorCode.count({ where: { status: 'ACTIVE' } }),
        prisma.apeSponsorCode.count({ where: { status: 'INACTIVE' } }),
        prisma.apeSponsorCode.count({ where: { status: 'EXPIRED' } }),
      ])

      return res.status(200).json({
        success: true,
        codes: codes.map((code: any) => ({
          id: code.id,
          code: code.code,
          description: code.description,
          status: code.status,
          usageCount: code.usageCount,
          maxUsage: code.maxUsage,
          expiresAt: code.expiresAt,
          createdAt: code.createdAt,
          updatedAt: code.updatedAt,
          createdBy: code.createdBy,
          createdByAdmin: code.createdByAdmin
            ? {
                id: code.createdByAdmin.id,
                name: code.createdByAdmin.name,
                email: code.createdByAdmin.email,
              }
            : null,
        })),
        stats: {
          total: totalCodes,
          active: activeCodes,
          inactive: inactiveCodes,
          expired: expiredCodes,
        },
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    }

    // For now, keep only GET supported (dashboard initial load)
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('Error handling sponsor codes:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
