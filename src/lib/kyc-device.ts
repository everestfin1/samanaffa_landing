/** Prefer Didit's SDK modal whenever the browser can securely access the camera. */
export function shouldUseDiditWebSdk(): boolean {
  if (typeof window === 'undefined') return false;
  return window.isSecureContext && !!navigator.mediaDevices?.getUserMedia;
}
