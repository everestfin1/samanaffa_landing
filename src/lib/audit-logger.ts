import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export interface AuditLogEntry {
  adminId: string
  action: string
  resourceType: string
  resourceId?: string
  details?: Record<string, any>
  request?: NextRequest
}

export async function logAdminAction(entry: AuditLogEntry): Promise<void> {
  try {
    const ipAddress = entry.request ? getClientIP(entry.request) : null
    const userAgent = entry.request?.headers.get('user-agent') || null

    await prisma.adminAuditLog.create({
      data: {
        adminId: entry.adminId,
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        details: entry.details,
        ipAddress,
        userAgent,
      }
    })
  } catch (error) {
    console.error('Failed to log admin action:', error)
    // Don't throw - audit logging should not break the main operation
  }
}

// Convenience functions for common admin actions
export async function logKYCApproval(
  adminId: string, 
  userId: string, 
  documentId: string, 
  request?: NextRequest
): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'KYC_APPROVED',
    resourceType: 'kyc_document',
    resourceId: documentId,
    details: { userId, documentId },
    request
  })
}

export async function logKYCRejection(
  adminId: string, 
  userId: string, 
  documentId: string, 
  reason: string,
  request?: NextRequest
): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'KYC_REJECTED',
    resourceType: 'kyc_document',
    resourceId: documentId,
    details: { userId, documentId, reason },
    request
  })
}

export async function logUserSuspension(
  adminId: string, 
  userId: string, 
  reason: string,
  request?: NextRequest
): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'USER_SUSPENDED',
    resourceType: 'user',
    resourceId: userId,
    details: { userId, reason },
    request
  })
}

export async function logUserActivation(
  adminId: string, 
  userId: string, 
  request?: NextRequest
): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'USER_ACTIVATED',
    resourceType: 'user',
    resourceId: userId,
    details: { userId },
    request
  })
}

export async function logTransactionUpdate(
  adminId: string, 
  transactionId: string, 
  oldStatus: string,
  newStatus: string,
  request?: NextRequest
): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'TRANSACTION_UPDATED',
    resourceType: 'transaction',
    resourceId: transactionId,
    details: { transactionId, oldStatus, newStatus },
    request
  })
}

export async function logAdminLogin(
  adminId: string, 
  request?: NextRequest
): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'ADMIN_LOGIN',
    resourceType: 'admin_session',
    details: { adminId },
    request
  })
}

export async function logAdminLogout(
  adminId: string, 
  request?: NextRequest
): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'ADMIN_LOGOUT',
    resourceType: 'admin_session',
    details: { adminId },
    request
  })
}

export async function logBulkOperation(
  adminId: string, 
  operation: string, 
  affectedCount: number,
  request?: NextRequest
): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'BULK_OPERATION',
    resourceType: 'bulk',
    details: { operation, affectedCount },
    request
  })
}

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(',')[0].trim()
  
  return 'unknown'
}

// Get audit logs for admin dashboard
export async function getAdminAuditLogs(
  adminId?: string,
  limit: number = 50,
  offset: number = 0
): Promise<any[]> {
  const where = adminId ? { adminId } : {}
  
  return await prisma.adminAuditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  })
}

// Get audit logs for a specific resource
export async function getResourceAuditLogs(
  resourceType: string,
  resourceId: string,
  limit: number = 50
): Promise<any[]> {
  return await prisma.adminAuditLog.findMany({
    where: {
      resourceType,
      resourceId
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  })
}
