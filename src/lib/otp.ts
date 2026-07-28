import { NextRequest } from 'next/server'
import { and, eq, gt, inArray, lt } from 'drizzle-orm'
import { db } from './db'
import { otpCodes, users } from './db/schema'
import { sendEmailOTP, sendSMSOTP } from './notifications'
import { generatePhoneFormats } from './utils'
import { generateSecureOtpCode } from './otp-crypto'
import {
  checkOTPVerifyRateLimitAsync,
  checkOTPVerifyRateLimitByKeyAsync,
  resetRateLimit,
  resetRateLimitByKey,
} from './rate-limit'
import type { User } from './db/schema'

export type VerifyOTPResult =
  | { success: true }
  | { success: false; error: 'invalid' }
  | {
      success: false
      error: 'rate_limited'
      resetTime: number
      blocked: boolean
    }

async function findUserByEmail(email: string): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  return user ?? null
}

async function findUserByPhoneFormats(formats: string[]): Promise<User | null> {
  const unique = [...new Set(formats.filter(Boolean))]
  if (unique.length === 0) return null
  const [user] = await db
    .select()
    .from(users)
    .where(inArray(users.phone, unique))
    .limit(1)
  return user ?? null
}

export async function verifyOTPWithRateLimit(
  request: NextRequest,
  identifier: string,
  code: string,
): Promise<VerifyOTPResult> {
  const normalized = String(code).replace(/\D/g, '').slice(0, 6)
  const rateLimit = await checkOTPVerifyRateLimitAsync(request, identifier)
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: 'rate_limited',
      resetTime: rateLimit.resetTime,
      blocked: rateLimit.blocked,
    }
  }
  const ok = await verifyOTP(identifier, normalized)
  if (ok) {
    resetRateLimit(request, 'otpVerify', identifier)
    return { success: true }
  }
  return { success: false, error: 'invalid' }
}

export async function verifyOTPWithRateLimitByKey(
  identifier: string,
  code: string,
): Promise<VerifyOTPResult> {
  const normalized = String(code).replace(/\D/g, '').slice(0, 6)
  const rateLimit = await checkOTPVerifyRateLimitByKeyAsync(identifier)
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: 'rate_limited',
      resetTime: rateLimit.resetTime,
      blocked: rateLimit.blocked,
    }
  }
  const ok = await verifyOTP(identifier, normalized)
  if (ok) {
    resetRateLimitByKey('otpVerify', identifier)
    return { success: true }
  }
  return { success: false, error: 'invalid' }
}

export async function generateOTP(userId: string, type: 'email' | 'sms'): Promise<string> {
  const otp = generateSecureOtpCode()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

  await db.insert(otpCodes).values({
    userId,
    code: otp,
    type: type.toUpperCase() as 'EMAIL' | 'SMS',
    expiresAt,
  })

  return otp
}

export async function verifyOTP(identifier: string, code: string): Promise<boolean> {
  const now = new Date()
  const baseConditions = and(
    eq(otpCodes.code, code),
    eq(otpCodes.used, false),
    gt(otpCodes.expiresAt, now),
  )

  const [byUser] = await db
    .update(otpCodes)
    .set({ used: true })
    .where(and(eq(otpCodes.userId, identifier), baseConditions))
    .returning({ id: otpCodes.id })

  if (byUser) {
    return true
  }

  const [bySession] = await db
    .update(otpCodes)
    .set({ used: true })
    .where(and(eq(otpCodes.registrationSessionId, identifier), baseConditions))
    .returning({ id: otpCodes.id })

  return !!bySession
}

export async function sendOTP(
  email?: string,
  phone?: string,
  type: 'login' | 'register' = 'login',
  preferredMethod?: 'email' | 'sms',
  registrationSessionId?: string,
): Promise<{ success: boolean; message: string }> {
  try {
    if (!email && !phone) {
      return { success: false, message: 'Email ou numéro de téléphone requis' }
    }

    let user: User | null = null

    if (registrationSessionId) {
      if (!email || !phone) {
        return {
          success: false,
          message: "Email et numéro de téléphone requis pour l'inscription",
        }
      }

      const existingEmailUser = await findUserByEmail(email)
      if (existingEmailUser) {
        return {
          success: false,
          message:
            'Cet email est déjà associé à un compte existant. Veuillez utiliser un autre email ou vous connecter.',
        }
      }

      const phoneFormats = [
        phone,
        phone.replace('+221', ''),
        phone.replace('+', ''),
        `+221${phone.replace('+221', '')}`,
      ].filter((format, index, arr) => arr.indexOf(format) === index)

      const existingPhoneUser = await findUserByPhoneFormats(phoneFormats)
      if (existingPhoneUser) {
        return {
          success: false,
          message:
            'Ce numéro de téléphone est déjà associé à un compte existant. Veuillez utiliser un autre numéro ou vous connecter.',
        }
      }
    } else {
      if (email) {
        user = await findUserByEmail(email)
      }

      if (!user && phone) {
        user = await findUserByPhoneFormats(generatePhoneFormats(phone))
      }

      if (!user) {
        if (type === 'login') {
          return {
            success: false,
            message: "Utilisateur non trouvé. Veuillez vous inscrire d'abord.",
          }
        }

        if (type === 'register') {
          if (!email || !phone) {
            return {
              success: false,
              message: "Email et numéro de téléphone requis pour l'inscription",
            }
          }

          const existingEmailUser = await findUserByEmail(email)
          if (existingEmailUser) {
            return {
              success: false,
              message:
                'Cet email est déjà associé à un compte existant. Veuillez utiliser un autre email ou vous connecter.',
            }
          }

          const existingPhoneUser = await findUserByPhoneFormats(generatePhoneFormats(phone))
          if (existingPhoneUser) {
            return {
              success: false,
              message:
                'Ce numéro de téléphone est déjà associé à un compte existant. Veuillez utiliser un autre numéro ou vous connecter.',
            }
          }

          ;[user] = await db
            .insert(users)
            .values({
              email,
              phone,
              firstName: 'Temporary',
              lastName: 'User',
            })
            .returning()
        }
      }
    }

    if (!registrationSessionId && !user) {
      return { success: false, message: "Échec du traitement de l'utilisateur" }
    }

    const isEmail = email && email.includes('@')
    const isPhone = phone && phone.startsWith('+')

    let otpType: 'email' | 'sms'
    let deliveryMethod: string
    let deliveryValue: string

    if (preferredMethod) {
      if (preferredMethod === 'email' && isEmail) {
        otpType = 'email'
        deliveryMethod = 'email'
        deliveryValue = email
      } else if (preferredMethod === 'sms' && isPhone) {
        otpType = 'sms'
        deliveryMethod = 'SMS'
        deliveryValue = phone
      } else if (preferredMethod === 'email' && !isEmail) {
        return { success: false, message: "Email requis pour l'envoi du code par email" }
      } else if (preferredMethod === 'sms' && !isPhone) {
        return {
          success: false,
          message: "Numéro de téléphone requis pour l'envoi du code par SMS",
        }
      } else {
        return { success: false, message: "Méthode d'envoi non disponible" }
      }
    } else if (isEmail && isPhone) {
      otpType = 'sms'
      deliveryMethod = 'SMS'
      deliveryValue = phone
    } else if (isEmail) {
      otpType = 'email'
      deliveryMethod = 'email'
      deliveryValue = email
    } else if (isPhone) {
      otpType = 'sms'
      deliveryMethod = 'SMS'
      deliveryValue = phone
    } else {
      return { success: false, message: "Format d'email ou numéro de téléphone invalide" }
    }

    try {
      if (registrationSessionId) {
        const otp = generateSecureOtpCode()
        await db.insert(otpCodes).values({
          userId: null,
          registrationSessionId,
          code: otp,
          type: otpType === 'email' ? 'EMAIL' : 'SMS',
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        })

        if (otpType === 'email') {
          await sendEmailOTP(deliveryValue, otp)
        } else {
          await sendSMSOTP(deliveryValue, otp)
        }
      } else {
        const otp = await generateOTP(user!.id, otpType)

        if (otpType === 'email') {
          await sendEmailOTP(deliveryValue, otp)
        } else {
          await sendSMSOTP(deliveryValue, otp)
        }
      }

      return {
        success: true,
        message: `Code OTP envoyé par ${deliveryMethod}`,
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      return { success: false, message: "Erreur lors de l'envoi du code OTP" }
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du code OTP:", error)
    return {
      success: false,
      message: "Échec de l'envoi du code OTP. Veuillez réessayer.",
    }
  }
}

/**
 * Sends a registration-session SMS code without checking whether an account
 * already exists. The onboarding route makes that decision itself, so keeping
 * it out of the delivery path is what lets send-otp answer identically for
 * registered and unregistered phones.
 */
export async function sendRegistrationSessionSmsOtp(
  registrationSessionId: string,
  phone: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const otp = generateSecureOtpCode()
    await db.insert(otpCodes).values({
      userId: null,
      registrationSessionId,
      code: otp,
      type: 'SMS',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    })
    await sendSMSOTP(phone, otp)
    return { success: true, message: 'Code OTP envoyé par SMS' }
  } catch (error) {
    console.error('Error sending registration session OTP:', error)
    return { success: false, message: "Erreur lors de l'envoi du code OTP" }
  }
}

export async function cleanupExpiredOTPs(): Promise<void> {
  await db.delete(otpCodes).where(lt(otpCodes.expiresAt, new Date()))
}
