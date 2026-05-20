import { randomInt } from 'crypto';

/** Cryptographically secure 6-digit OTP (AUTH-005). */
export function generateSecureOtpCode(): string {
  return String(randomInt(100000, 1000000));
}
