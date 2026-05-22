import { prisma } from '@/lib/prisma';
import type { NotificationPriority, NotificationType } from '@/lib/types';
import { isAllowedNotificationActionUrl } from '@/lib/notification-url-allowlist';

/** Strip unsafe actionUrl values at write time (AUTH-025). */
export function sanitizeNotificationActionUrl(url: unknown): string | undefined {
  if (typeof url !== 'string') return undefined;
  const trimmed = url.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return undefined;
  if (!isAllowedNotificationActionUrl(trimmed)) return undefined;
  return trimmed;
}

function sanitizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!metadata) return undefined;
  const next = { ...metadata };
  if ('actionUrl' in next) {
    const safe = sanitizeNotificationActionUrl(next.actionUrl);
    if (safe) {
      next.actionUrl = safe;
    } else {
      delete next.actionUrl;
    }
  }
  return next;
}

export async function createUserNotification(
  userId: string,
  payload: {
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    metadata?: Record<string, unknown>;
  },
): Promise<boolean> {
  try {
    const metadata = sanitizeMetadata(payload.metadata);
    await prisma.notification.create({
      data: {
        userId,
        title: payload.title,
        message: payload.message,
        type: payload.type,
        priority: payload.priority,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
    return true;
  } catch (e) {
    console.error('[user-notifications] create failed:', e);
    return false;
  }
}
