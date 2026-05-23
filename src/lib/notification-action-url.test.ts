import { describe, expect, it } from 'vitest';
import { getNotificationActionUrl } from '@/lib/notification-action-url';
import { sanitizeNotificationActionUrl } from '@/lib/user-notifications';

describe('getNotificationActionUrl', () => {
  it('routes kyc_status by metadata.kycStatus', () => {
    expect(
      getNotificationActionUrl({
        type: 'KYC_STATUS',
        title: 'KYC',
        metadata: JSON.stringify({ kind: 'kyc_status', kycStatus: 'UNDER_REVIEW' }),
      }),
    ).toBe('/portal/dashboard');

    expect(
      getNotificationActionUrl({
        type: 'KYC_STATUS',
        title: 'KYC',
        metadata: JSON.stringify({ kind: 'kyc_status', kycStatus: 'APPROVED' }),
      }),
    ).toBe('/portal/sama-naffa?confirmDeposit=1');
  });

  it('rejects unsafe actionUrl in metadata', () => {
    expect(
      getNotificationActionUrl({
        type: 'WARNING',
        title: 'Test',
        metadata: JSON.stringify({ actionUrl: 'https://evil.com' }),
      }),
    ).toBe('/portal/dashboard');

    expect(
      getNotificationActionUrl({
        type: 'WARNING',
        title: 'Test',
        metadata: JSON.stringify({ actionUrl: '//evil.com/phish' }),
      }),
    ).toBe('/portal/dashboard');
  });

  it('allows safe internal actionUrl', () => {
    expect(
      getNotificationActionUrl({
        type: 'SUCCESS',
        title: 'Test',
        metadata: JSON.stringify({ actionUrl: '/portal/profile' }),
      }),
    ).toBe('/portal/profile');
  });
});

describe('sanitizeNotificationActionUrl', () => {
  it('allows portal paths', () => {
    expect(sanitizeNotificationActionUrl('/portal/dashboard')).toBe('/portal/dashboard');
  });

  it('blocks external and protocol-relative URLs', () => {
    expect(sanitizeNotificationActionUrl('https://evil.com')).toBeUndefined();
    expect(sanitizeNotificationActionUrl('//evil.com')).toBeUndefined();
    expect(sanitizeNotificationActionUrl('/admin/secret')).toBeUndefined();
  });
});
