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
    const verificationStatus = url.searchParams.get('verificationStatus')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where = verificationStatus ? { verificationStatus: verificationStatus.toUpperCase() } : {}

    const [kycDocuments, total] = await Promise.all([
      prisma.kycDocument.findMany({
        where: where as any,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              kycStatus: true,
            },
          },
        },
        orderBy: { uploadDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.kycDocument.count({ where: where as any }),
    ])

    return res.status(200).json({
      success: true,
      kycDocuments: kycDocuments.map((doc: any) => ({
        id: doc.id,
        documentType: doc.documentType,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        uploadDate: doc.uploadDate,
        verificationStatus: doc.verificationStatus,
        adminNotes: doc.adminNotes,
        user: {
          id: doc.user.id,
          name: `${doc.user.firstName} ${doc.user.lastName}`,
          email: doc.user.email,
          phone: doc.user.phone,
          kycStatus: doc.user.kycStatus,
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
    console.error('Error fetching KYC documents:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
