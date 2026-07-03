import type { NextRequest } from 'next/server';

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}

function isLocalhostHostname(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function isLocalhostUrl(url: string): boolean {
  try {
    return isLocalhostHostname(new URL(url).hostname);
  } catch {
    return false;
  }
}

function originFromRequest(request: NextRequest): string | null {
  const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host'))
    ?.split(',')[0]
    ?.trim();
  if (!host) return null;

  const proto =
    request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ??
    (isLocalhostHostname(host.split(':')[0]) ? 'http' : 'https');

  return `${proto}://${host}`;
}

/**
 * Canonical app origin for server-side callbacks (Didit, emails, etc.).
 * Prefer NEXT_PUBLIC_APP_URL when set to a non-localhost URL; otherwise use the
 * incoming request host (works on custom preview domains like dev.samanaffa.com).
 */
export function getAppBaseUrl(request?: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv && !isLocalhostUrl(fromEnv)) {
    return stripTrailingSlash(fromEnv);
  }

  if (request) {
    const fromRequest = originFromRequest(request);
    if (fromRequest && !isLocalhostUrl(fromRequest)) {
      return stripTrailingSlash(fromRequest);
    }
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (fromEnv) return stripTrailingSlash(fromEnv);

  return 'http://localhost:3000';
}

function isTestIntouchEnvironment(): boolean {
  return (
    process.env.NEXT_PUBLIC_APP_ENV === 'development' ||
    process.env.NEXT_PUBLIC_APP_ENV === 'test' ||
    process.env.VERCEL_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview' ||
    (!process.env.NEXT_PUBLIC_APP_ENV && process.env.NODE_ENV !== 'production')
  );
}

/**
 * Base URL for InTouch browser redirects (success / failed pages).
 * InTouch only honors redirect URLs on the registered merchant domain — passing
 * http://localhost while domain=dev.samanaffa.com leaves users on touchpay.gutouch.net.
 */
export function getClientAppBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (fromEnv && !isLocalhostUrl(fromEnv)) {
      return stripTrailingSlash(fromEnv);
    }

    const intouchDomain = (
      isTestIntouchEnvironment()
        ? process.env.NEXT_PUBLIC_INTOUCH_TEST_DOMAIN
        : process.env.NEXT_PUBLIC_INTOUCH_DOMAIN
    )
      ?.trim()
      .replace(/^https?:\/\//, '');

    if (intouchDomain && isLocalhostUrl(window.location.origin)) {
      return `https://${intouchDomain}`;
    }

    return stripTrailingSlash(window.location.origin);
  }

  return getAppBaseUrl();
}

/**
 * Server-to-server Intouch callback URL.
 * Prefer INTOUCH_CALLBACK_URL on STELLARIX; otherwise derive from the app base URL.
 */
export function getIntouchCallbackUrl(request?: NextRequest): string {
  const fromEnv = process.env.INTOUCH_CALLBACK_URL?.trim();
  if (fromEnv) {
    return stripTrailingSlash(fromEnv);
  }
  return `${getAppBaseUrl(request)}/api/payments/intouch/callback`;
}
