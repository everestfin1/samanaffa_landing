/** Latest Didit KYC session stored on user profile (fileUrl = session id). */
export function getLatestDiditSession(
  docs: Array<{
    documentType: string;
    fileUrl: string;
    verificationStatus: string;
    uploadDate?: string;
  }>,
): { sessionId: string; verificationStatus: string } | null {
  const diditSessions = docs
    .filter((d) => d.documentType === 'didit_kyc_session' && d.fileUrl)
    .sort(
      (a, b) =>
        new Date(b.uploadDate ?? 0).getTime() - new Date(a.uploadDate ?? 0).getTime(),
    );

  const latest = diditSessions[0];
  if (!latest) return null;

  return {
    sessionId: latest.fileUrl,
    verificationStatus: latest.verificationStatus,
  };
}
