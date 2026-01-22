import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-in-production'

export async function requireAdminFromRequest(request: Request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return {
      admin: null,
      response: Response.json({ success: false, error: 'Unauthorized' }, { status: 401 }),
    }
  }

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as { adminId: string }

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.adminId },
    })

    if (!admin || !admin.isActive) {
      return {
        admin: null,
        response: Response.json({ success: false, error: 'Unauthorized' }, { status: 401 }),
      }
    }

    return { admin, response: null }
  } catch {
    return {
      admin: null,
      response: Response.json({ success: false, error: 'Unauthorized' }, { status: 401 }),
    }
  }
}
