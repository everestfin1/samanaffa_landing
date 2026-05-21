const DIDIT_BASE = 'https://verification.didit.me/v3';

export type DiditCaptureMethod = 'mobile' | 'desktop' | 'both';

const DESKTOP_FRIENDLY: DiditCaptureMethod[] = ['both', 'desktop'];

let captureMethodEnsured = false;

function resolveDesiredCaptureMethod(): DiditCaptureMethod {
  const raw = process.env.DIDIT_CAPTURE_METHOD?.trim().toLowerCase();
  if (raw === 'desktop' || raw === 'both' || raw === 'mobile') {
    return raw;
  }
  return 'both';
}

function isDesktopFriendly(method: string | undefined): boolean {
  return DESKTOP_FRIENDLY.includes(method as DiditCaptureMethod);
}

/**
 * Didit shows the QR “continue on mobile” screen when capture_method is `mobile`.
 * Ensure the account allows desktop capture before creating KYC sessions.
 */
export async function ensureDiditCaptureMethodAllowsDesktop(apiKey: string): Promise<void> {
  if (captureMethodEnsured) return;
  if (process.env.DIDIT_ENSURE_CAPTURE_METHOD === 'false') {
    captureMethodEnsured = true;
    return;
  }

  const desired = resolveDesiredCaptureMethod();
  if (desired === 'mobile') {
    captureMethodEnsured = true;
    return;
  }

  try {
    const getRes = await fetch(`${DIDIT_BASE}/webhook/`, {
      headers: { 'x-api-key': apiKey },
      cache: 'no-store',
    });

    if (!getRes.ok) {
      console.warn('[didit/capture-method] Could not read webhook config:', getRes.status);
      return;
    }

    const config = (await getRes.json()) as { capture_method?: string };
    const current = config.capture_method;

    if (isDesktopFriendly(current) && (desired === 'both' || current === desired)) {
      captureMethodEnsured = true;
      return;
    }

    if (current === 'mobile' || (desired === 'desktop' && current !== 'desktop')) {
      const patchRes = await fetch(`${DIDIT_BASE}/webhook/`, {
        method: 'PATCH',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ capture_method: desired }),
      });

      if (patchRes.ok) {
        console.info(`[didit/capture-method] Updated ${current ?? 'unknown'} → ${desired}`);
        captureMethodEnsured = true;
        return;
      }

      const errText = await patchRes.text().catch(() => '');
      console.warn('[didit/capture-method] PATCH failed:', patchRes.status, errText);
      return;
    }

    captureMethodEnsured = true;
  } catch (error) {
    console.warn('[didit/capture-method] ensure failed (non-fatal):', error);
  }
}

/** Reset in-memory guard (tests only). */
export function resetDiditCaptureMethodCache(): void {
  captureMethodEnsured = false;
}
