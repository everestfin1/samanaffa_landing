import type { VercelRequest } from '@vercel/node'
import jwt from 'jsonwebtoken'
import { prisma } from '../_db'

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-in-production'

export async function requireAdmin(req: VercelRequest): Promise<{ adminId: string } | null> {
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
