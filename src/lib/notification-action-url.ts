/** Shared deep-link resolution for portal notifications (ONB-031). */

import { isAllowedNotificationActionUrl } from '@/lib/notification-url-allowlist';

export type NotificationLinkInput = {
  type: string;
  title: string;
  metadata?: string | null;
};

type ParsedMetadata = {
  actionUrl?: string;
  kind?: string;
  kycStatus?: string;
};

function parseMetadata(raw: string | null | undefined): ParsedMetadata | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ParsedMetadata;
  } catch {
    return null;
  }
}

/** Safe internal paths only (no open redirect). */
function isSafeInternalPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//');
}

function kycStatusActionUrl(kycStatus: string | undefined): string | null {
  switch (kycStatus) {
    case 'APPROVED':
      return '/portal/sama-naffa?confirmDeposit=1';
    case 'REJECTED':
      return '/portal/profile';
    case 'UNDER_REVIEW':
      return '/portal/dashboard';
    default:
      return '/portal/profile';
  }
}

export function getNotificationActionUrl(notification: NotificationLinkInput): string | null {
  const metadata = parseMetadata(notification.metadata);

  if (
    metadata?.actionUrl &&
    isSafeInternalPath(metadata.actionUrl) &&
    isAllowedNotificationActionUrl(metadata.actionUrl)
  ) {
    return metadata.actionUrl;
  }

  if (metadata?.kind?.startsWith('onboarding_deposit')) {
    return '/portal/sama-naffa?confirmDeposit=1';
  }

  if (metadata?.kind === 'kyc_status') {
    return kycStatusActionUrl(metadata.kycStatus);
  }

  if (notification.type === 'KYC_STATUS' || notification.title.includes('Identité')) {
    return '/portal/profile';
  }

  if (notification.type === 'TRANSACTION' || notification.title.toLowerCase().includes('dépôt')) {
    return '/portal/sama-naffa?confirmDeposit=1';
  }

  return '/portal/dashboard';
}
