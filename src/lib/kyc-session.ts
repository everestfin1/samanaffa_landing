/** Latest Didit KYC session on user profile (fileUrl = session id). */
const RESUMABLE_DIDIT_STATUSES = new Set(['PENDING', 'UNDER_REVIEW']);

export type DiditSessionQueryMode =
  /** Only PENDING / UNDER_REVIEW — for resuming in-flight verification. */
  | 'resumable'
  /** Most recent session regardless of doc status — for status polling when DB is in review. */
  | 'poll';

function uploadTimestamp(uploadDate?: string): number {
  if (!uploadDate) return 0;
  const t = new Date(uploadDate).getTime();
  return Number.isFinite(t) ? t : 0;
}

export function getLatestDiditSession(
  docs: Array<{
    documentType: string;
    fileUrl: string;
    verificationStatus: string;
    uploadDate?: string;
  }>,
  mode: DiditSessionQueryMode = 'resumable',
): { sessionId: string; verificationStatus: string } | null {
  const diditSessions = docs
    .filter((d) => {
      if (d.documentType !== 'didit_kyc_session' || !d.fileUrl) return false;
      if (mode === 'poll') return true;
      return RESUMABLE_DIDIT_STATUSES.has(d.verificationStatus);
    })
    .sort((a, b) => uploadTimestamp(b.uploadDate) - uploadTimestamp(a.uploadDate));

  const latest = diditSessions[0];
  if (!latest) return null;

  return {
    sessionId: latest.fileUrl,
    verificationStatus: latest.verificationStatus,
  };
}
