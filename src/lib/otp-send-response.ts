/** Generic OTP send copy — avoids user enumeration (AUTH-007). */
export const GENERIC_OTP_SEND_MESSAGE =
  'Si un compte existe pour ce numéro, un code a été envoyé par SMS.';

export function genericOtpSendResponse(extra?: Record<string, unknown>) {
  return {
    success: true,
    message: GENERIC_OTP_SEND_MESSAGE,
    ...extra,
  };
}
