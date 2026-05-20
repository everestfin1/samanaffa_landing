/** Shared deep-link resolution for portal notifications (ONB-031). */

export type NotificationLinkInput = {
  type: string;
  title: string;
  metadata?: string | null;
};

export function getNotificationActionUrl(notification: NotificationLinkInput): string | null {
  try {
    if (notification.metadata) {
      const metadata = JSON.parse(notification.metadata) as {
        actionUrl?: string;
        kind?: string;
      };
      if (metadata.actionUrl) return metadata.actionUrl;
      if (metadata.kind?.startsWith('onboarding_deposit')) {
        return '/portal/sama-naffa?confirmDeposit=1';
      }
      if (metadata.kind === 'kyc_status') {
        return '/portal/sama-naffa?confirmDeposit=1';
      }
    }
  } catch {
    // ignore invalid metadata
  }

  if (notification.type === 'KYC_STATUS' || notification.title.includes('Identité')) {
    return '/portal/sama-naffa';
  }

  if (notification.type === 'TRANSACTION' || notification.title.toLowerCase().includes('dépôt')) {
    return '/portal/sama-naffa?confirmDeposit=1';
  }

  return '/portal/dashboard';
}
