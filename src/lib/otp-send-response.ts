/** Generic OTP send copy — avoids user enumeration (AUTH-007). */
export const GENERIC_OTP_SEND_MESSAGE =
  'Si ce numéro est enregistré, un SMS avec un code à 6 chiffres vient d’être envoyé.';

/** Shown on the OTP step in mock mode after a real send. */
export const MOCK_OTP_SEND_MESSAGE =
  'Mode test : aucun SMS réel. Utilisez le code affiché ci-dessous.';

/**
 * Dev/preview only (MOCK_OTP): explicit when no user row exists — not returned in production.
 */
export const DEV_NO_ACCOUNT_MESSAGE =
  'Mode développement : aucun compte en base pour ce numéro. Aucun code n’a été généré.';

export function genericOtpSendResponse(extra?: Record<string, unknown>) {
  return {
    success: true,
    message: GENERIC_OTP_SEND_MESSAGE,
    ...extra,
  };
}
