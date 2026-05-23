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

  it('returns the most recent resumable didit_kyc_session by uploadDate', () => {
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

  it('ignores terminal didit sessions (approved/rejected)', () => {
    expect(
      getLatestDiditSession([
        {
          documentType: 'didit_kyc_session',
          fileUrl: 'done',
          verificationStatus: 'APPROVED',
          uploadDate: '2026-05-01T00:00:00.000Z',
        },
        {
          documentType: 'didit_kyc_session',
          fileUrl: 'active',
          verificationStatus: 'UNDER_REVIEW',
          uploadDate: '2026-01-01T00:00:00.000Z',
        },
      ]),
    ).toEqual({
      sessionId: 'active',
      verificationStatus: 'UNDER_REVIEW',
    });
  });

  it('poll mode returns latest session even when doc status is terminal', () => {
    const result = getLatestDiditSession(
      [
        {
          documentType: 'didit_kyc_session',
          fileUrl: 'old-active',
          verificationStatus: 'UNDER_REVIEW',
          uploadDate: '2026-01-01T00:00:00.000Z',
        },
        {
          documentType: 'didit_kyc_session',
          fileUrl: 'newest-approved',
          verificationStatus: 'APPROVED',
          uploadDate: '2026-06-01T00:00:00.000Z',
        },
      ],
      'poll',
    );
    expect(result?.sessionId).toBe('newest-approved');
  });

  it('treats invalid uploadDate as oldest', () => {
    const result = getLatestDiditSession([
      {
        documentType: 'didit_kyc_session',
        fileUrl: 'bad-date',
        verificationStatus: 'PENDING',
        uploadDate: 'not-a-date',
      },
      {
        documentType: 'didit_kyc_session',
        fileUrl: 'good-date',
        verificationStatus: 'PENDING',
        uploadDate: '2026-05-01T00:00:00.000Z',
      },
    ]);
    expect(result?.sessionId).toBe('good-date');
  });
});
