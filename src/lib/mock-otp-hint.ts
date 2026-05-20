import { NextRequest } from 'next/server';
import { isMockOtpEnabled } from './mock-otp';

type MockSendRecord = { sentAt: number; ip: string };

const recentMockSends = new Map<string, MockSendRecord>();
const SEND_TTL_MS = 5 * 60 * 1000;

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}

/** Record that OTP was sent for this phone (mock mode only, AUTH-020). */
export function recordMockOtpSend(request: NextRequest, normalizedPhone: string): void {
  if (!isMockOtpEnabled()) return;
  recentMockSends.set(normalizedPhone, { sentAt: Date.now(), ip: getClientIP(request) });
}

/** Whether dev hint API may return the code for this phone from the same IP. */
export function canRevealMockOtp(request: NextRequest, normalizedPhone: string): boolean {
  if (!isMockOtpEnabled()) return false;
  const record = recentMockSends.get(normalizedPhone);
  if (!record) return false;
  if (Date.now() - record.sentAt > SEND_TTL_MS) {
    recentMockSends.delete(normalizedPhone);
    return false;
  }
  return record.ip === getClientIP(request);
}

export function logMockOtp(context: string, identifier: string, code: string): void {
  if (!isMockOtpEnabled()) return;
  console.info(`[mock-otp] ${context} id=${identifier} code=${code}`);
}
