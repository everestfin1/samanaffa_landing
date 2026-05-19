/** Session keys for Didit KYC same-tab return flow */
export const KYC_RETURN_PATH_KEY = 'sama_kyc_return_to';
export const KYC_SESSION_ID_KEY = 'sama_kyc_session_id';

export function setKycReturnPath(path: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(KYC_RETURN_PATH_KEY, path);
}

export function getKycReturnPath(): string {
  if (typeof window === 'undefined') return '/onboarding';
  return sessionStorage.getItem(KYC_RETURN_PATH_KEY) ?? '/onboarding';
}

export function setKycSessionId(sessionId: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(KYC_SESSION_ID_KEY, sessionId);
}

export function getKycSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(KYC_SESSION_ID_KEY);
}

export function clearKycNavigationState() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(KYC_RETURN_PATH_KEY);
  sessionStorage.removeItem(KYC_SESSION_ID_KEY);
}

/** Navigate to Didit in the same tab (avoids a confusing second tab). */
export function navigateToDiditVerification(verificationUrl: string, sessionId: string, returnPath: string) {
  setKycReturnPath(returnPath);
  setKycSessionId(sessionId);
  window.location.href = verificationUrl;
}
