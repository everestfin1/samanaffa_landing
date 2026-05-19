import { prisma } from '@/lib/prisma';
import type { NotificationPriority, NotificationType } from '@/lib/types';

export async function createUserNotification(
  userId: string,
  payload: {
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title: payload.title,
        message: payload.message,
        type: payload.type,
        priority: payload.priority,
        metadata: payload.metadata ? JSON.stringify(payload.metadata) : null,
      },
    });
  } catch (e) {
    console.error('[user-notifications] create failed:', e);
  }
}
