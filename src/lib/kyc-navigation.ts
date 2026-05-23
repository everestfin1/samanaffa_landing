/** Session keys for Didit KYC same-tab return flow */
export const KYC_RETURN_PATH_KEY = 'sama_kyc_return_to';
export const KYC_SESSION_ID_KEY = 'sama_kyc_session_id';
export const KYC_VERIFICATION_URL_KEY = 'sama_kyc_verification_url';

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

export function setKycVerificationUrl(url: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(KYC_VERIFICATION_URL_KEY, url);
}

export function getKycVerificationUrl(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(KYC_VERIFICATION_URL_KEY);
}

export function clearKycNavigationState() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(KYC_RETURN_PATH_KEY);
  sessionStorage.removeItem(KYC_SESSION_ID_KEY);
  sessionStorage.removeItem(KYC_VERIFICATION_URL_KEY);
}

function persistDiditNavigationState(verificationUrl: string, sessionId: string, returnPath: string) {
  setKycReturnPath(returnPath);
  setKycSessionId(sessionId);
  setKycVerificationUrl(verificationUrl);
}

/** Navigate to Didit in the same tab (onboarding default). */
export function navigateToDiditVerification(
  verificationUrl: string,
  sessionId: string,
  returnPath: string,
) {
  persistDiditNavigationState(verificationUrl, sessionId, returnPath);
  window.location.href = verificationUrl;
}

/** Open Didit in a new tab; caller stays on portal and keeps polling (ONB-044). */
export function openDiditVerificationInNewTab(
  verificationUrl: string,
  sessionId: string,
  returnPath: string,
): void {
  persistDiditNavigationState(verificationUrl, sessionId, returnPath);
  window.open(verificationUrl, '_blank', 'noopener,noreferrer');
}
