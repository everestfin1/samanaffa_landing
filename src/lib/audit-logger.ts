import { NextRequest } from 'next/server';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { adminAuditLogs, adminUsers } from '@/lib/db/schema';

export interface AuditLogEntry {
  adminId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  request?: NextRequest;
}

type AuditLogWithAdmin = typeof adminAuditLogs.$inferSelect & {
  admin: {
    id: string;
    name: string;
    email: string;
    role: typeof adminUsers.$inferSelect.role;
  } | null;
};

async function attachAdmins(
  logs: (typeof adminAuditLogs.$inferSelect)[],
): Promise<AuditLogWithAdmin[]> {
  if (logs.length === 0) return [];

  const adminIds = [...new Set(logs.map((log) => log.adminId))];
  const admins = await db
    .select({
      id: adminUsers.id,
      name: adminUsers.name,
      email: adminUsers.email,
      role: adminUsers.role,
    })
    .from(adminUsers)
    .where(inArray(adminUsers.id, adminIds));

  return logs.map((log) => ({
    ...log,
    admin: admins.find((admin) => admin.id === log.adminId) ?? null,
  }));
}

export async function logAdminAction(entry: AuditLogEntry): Promise<void> {
  try {
    const ipAddress = entry.request ? getClientIP(entry.request) : null;
    const userAgent = entry.request?.headers.get('user-agent') || null;

    await db.insert(adminAuditLogs).values({
      adminId: entry.adminId,
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      details: entry.details ?? null,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}

export async function logKYCApproval(
  adminId: string,
  userId: string,
  documentId: string,
  request?: NextRequest,
): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'KYC_APPROVED',
    resourceType: 'kyc_document',
    resourceId: documentId,
    details: { userId, documentId },
    request,
  });
}

export async function logKYCRejection(
  adminId: string,
  userId: string,
  documentId: string,
  reason: string,
  request?: NextRequest,
): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'KYC_REJECTED',
    resourceType: 'kyc_document',
    resourceId: documentId,
    details: { userId, documentId, reason },
    request,
  });
}

export async function logUserSuspension(
  adminId: string,
  userId: string,
  reason: string,
  request?: NextRequest,
): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'USER_SUSPENDED',
    resourceType: 'user',
    resourceId: userId,
    details: { userId, reason },
    request,
  });
}

export async function logUserActivation(
  adminId: string,
  userId: string,
  request?: NextRequest,
): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'USER_ACTIVATED',
    resourceType: 'user',
    resourceId: userId,
    details: { userId },
    request,
  });
}

export async function logTransactionUpdate(
  adminId: string,
  transactionId: string,
  oldStatus: string,
  newStatus: string,
  request?: NextRequest,
): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'TRANSACTION_UPDATED',
    resourceType: 'transaction',
    resourceId: transactionId,
    details: { transactionId, oldStatus, newStatus },
    request,
  });
}

export async function logAdminLogin(adminId: string, request?: NextRequest): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'ADMIN_LOGIN',
    resourceType: 'admin_session',
    details: { adminId },
    request,
  });
}

export async function logAdminLogout(adminId: string, request?: NextRequest): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'ADMIN_LOGOUT',
    resourceType: 'admin_session',
    details: { adminId },
    request,
  });
}

export async function logBulkOperation(
  adminId: string,
  operation: string,
  affectedCount: number,
  request?: NextRequest,
): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'BULK_OPERATION',
    resourceType: 'bulk',
    details: { operation, affectedCount },
    request,
  });
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();

  return 'unknown';
}

export async function getAdminAuditLogs(
  adminId?: string,
  limit: number = 50,
  offset: number = 0,
): Promise<AuditLogWithAdmin[]> {
  const logs = await db
    .select()
    .from(adminAuditLogs)
    .where(adminId ? eq(adminAuditLogs.adminId, adminId) : undefined)
    .orderBy(desc(adminAuditLogs.createdAt))
    .limit(limit)
    .offset(offset);

  return attachAdmins(logs);
}

export async function getResourceAuditLogs(
  resourceType: string,
  resourceId: string,
  limit: number = 50,
): Promise<AuditLogWithAdmin[]> {
  const logs = await db
    .select()
    .from(adminAuditLogs)
    .where(
      and(
        eq(adminAuditLogs.resourceType, resourceType),
        eq(adminAuditLogs.resourceId, resourceId),
      ),
    )
    .orderBy(desc(adminAuditLogs.createdAt))
    .limit(limit);

  return attachAdmins(logs);
}
