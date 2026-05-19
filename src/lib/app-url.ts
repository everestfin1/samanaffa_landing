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
