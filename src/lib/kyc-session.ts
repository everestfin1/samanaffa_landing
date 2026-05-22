/** Latest resumable Didit KYC session on user profile (fileUrl = session id). */
const RESUMABLE_DIDIT_STATUSES = new Set(['PENDING', 'UNDER_REVIEW']);

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
): { sessionId: string; verificationStatus: string } | null {
  const diditSessions = docs
    .filter(
      (d) =>
        d.documentType === 'didit_kyc_session' &&
        d.fileUrl &&
        RESUMABLE_DIDIT_STATUSES.has(d.verificationStatus),
    )
    .sort((a, b) => uploadTimestamp(b.uploadDate) - uploadTimestamp(a.uploadDate));

  const latest = diditSessions[0];
  if (!latest) return null;

  return {
    sessionId: latest.fileUrl,
    verificationStatus: latest.verificationStatus,
  };
}
