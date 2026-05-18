/** True only when mock OTP is explicitly enabled outside production. */
export function isMockOtpEnabled(): boolean {
  return process.env.MOCK_OTP === 'true' && process.env.NODE_ENV !== 'production';
}
