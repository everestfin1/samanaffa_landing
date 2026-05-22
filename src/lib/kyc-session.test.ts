import { describe, expect, it } from 'vitest';
import { getLatestDiditSession } from '@/lib/kyc-session';

describe('getLatestDiditSession', () => {
  it('returns null when no didit sessions exist', () => {
    expect(getLatestDiditSession([])).toBeNull();
    expect(
      getLatestDiditSession([
        { documentType: 'passport', fileUrl: 'x', verificationStatus: 'PENDING' },
      ]),
    ).toBeNull();
  });

  it('returns the most recent didit_kyc_session by uploadDate', () => {
    const result = getLatestDiditSession([
      {
        documentType: 'didit_kyc_session',
        fileUrl: 'old-session',
        verificationStatus: 'UNDER_REVIEW',
        uploadDate: '2026-01-01T00:00:00.000Z',
      },
      {
        documentType: 'didit_kyc_session',
        fileUrl: 'new-session',
        verificationStatus: 'PENDING',
        uploadDate: '2026-05-01T00:00:00.000Z',
      },
    ]);
    expect(result).toEqual({
      sessionId: 'new-session',
      verificationStatus: 'PENDING',
    });
  });
});
