import { prisma } from './prisma'
import { sendEmailOTP, sendSMSOTP } from './notifications'
import { generatePhoneFormats } from './utils'
import type { User } from './db/schema'

export async function generateOTP(userId: string, type: 'email' | 'sms'): Promise<string> {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  
  // Store OTP in database with 5-minute expiry
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  
  await prisma.otpCode.create({
    data: {
      userId,
      code: otp,
      type: type.toUpperCase() as 'EMAIL' | 'SMS',
      expiresAt,
    }
  })

  return otp
}

export async function verifyOTP(identifier: string, code: string): Promise<boolean> {
  // Try to find OTP by userId first (for login), then by registrationSessionId (for registration)
  let otpRecord = await prisma.otpCode.findFirst({
    where: {
      userId: identifier,
      code,
      used: false,
      expiresAt: {
        gt: new Date()
      }
    }
  })

  // If not found by userId, try registrationSessionId
  if (!otpRecord) {
    otpRecord = await prisma.otpCode.findFirst({
      where: {
        registrationSessionId: identifier,
        code,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      }
    })
  }

  if (!otpRecord) {
    return false
  }

  // Mark OTP as used
  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { used: true }
  })

  return true
}

export async function sendOTP(email?: string, phone?: string, type: 'login' | 'register' = 'login', preferredMethod?: 'email' | 'sms', registrationSessionId?: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!email && !phone) {
      return { success: false, message: 'Email ou numéro de téléphone requis' }
    }

    let user: User | null = null

    // For registration sessions, we don't need to find/create a user yet
    if (registrationSessionId) {
      // For registration sessions, just check for duplicates but don't create user yet
      if (!email || !phone) {
        return { success: false, message: 'Email et numéro de téléphone requis pour l\'inscription' }
      }

      // Check if email is already taken
      const existingEmailUser = await prisma.user.findFirst({
        where: { email }
      })

      if (existingEmailUser) {
        return { success: false, message: 'Cet email est déjà associé à un compte existant. Veuillez utiliser un autre email ou vous connecter.' }
      }

      // Check if phone is already taken (try multiple formats)
      const phoneFormats = [
        phone, // normalized format (should be +221XXXXXXXXX)
        phone.replace('+221', ''), // without country code
        phone.replace('+', ''), // without + sign
        `+221${phone.replace('+221', '')}`, // ensure +221 prefix
      ].filter((format, index, arr) => arr.indexOf(format) === index) // remove duplicates

      for (const phoneFormat of phoneFormats) {
        const existingPhoneUser = await prisma.user.findFirst({
          where: { phone: phoneFormat }
        })

        if (existingPhoneUser) {
          return { success: false, message: 'Ce numéro de téléphone est déjà associé à un compte existant. Veuillez utiliser un autre numéro ou vous connecter.' }
        }
      }
    } else {
      // Original logic for login and direct registration (without session)
      // Find user - try multiple phone formats for better compatibility

      if (email) {
        // First try email lookup
        user = await prisma.user.findFirst({
          where: { email }
        })
        console.log('🔍 Email lookup result:', { email, found: !!user })
      }

      if (!user && phone) {
        // Try multiple phone number formats for lookup
        const phoneFormats = generatePhoneFormats(phone)

        console.log('🔍 Phone lookup formats to try:', phoneFormats)

        for (const phoneFormat of phoneFormats) {
          user = await prisma.user.findFirst({
            where: { phone: phoneFormat }
          })
          console.log('🔍 Phone lookup attempt:', { format: phoneFormat, found: !!user })

          if (user) {
            console.log('✅ User found with phone format:', phoneFormat)
            break
          }
        }
      }

      if (!user) {
        // For login: user must exist
        if (type === 'login') {
          return { success: false, message: 'Utilisateur non trouvé. Veuillez vous inscrire d\'abord.' }
        }

        // For registration: check for duplicates before creating user
        if (type === 'register') {
          if (!email || !phone) {
            return { success: false, message: 'Email et numéro de téléphone requis pour l\'inscription' }
          }

          // Check if email is already taken
          const existingEmailUser = await prisma.user.findFirst({
            where: { email }
          })

          if (existingEmailUser) {
            return { success: false, message: 'Cet email est déjà associé à un compte existant. Veuillez utiliser un autre email ou vous connecter.' }
          }

          // Check if phone is already taken (try multiple formats)
          const phoneFormats = generatePhoneFormats(phone)

          for (const phoneFormat of phoneFormats) {
            const existingPhoneUser = await prisma.user.findFirst({
              where: { phone: phoneFormat }
            })

            if (existingPhoneUser) {
              return { success: false, message: 'Ce numéro de téléphone est déjà associé à un compte existant. Veuillez utiliser un autre numéro ou vous connecter.' }
            }
          }

          // Create new user since no duplicates found
          user = await prisma.user.create({
            data: {
              email,
              phone,
              firstName: 'Temporary', // Will be updated after OTP verification
              lastName: 'User',
            }
          })
        }
      }
    }

    // For registration sessions, we don't need a user, so skip the user check
    if (!registrationSessionId && !user) {
      return { success: false, message: 'Échec du traitement de l\'utilisateur' }
    }

    // Determine OTP delivery method based on user preference or available options
    const isEmail = email && email.includes('@')
    const isPhone = phone && phone.startsWith('+')

    let otpType: 'email' | 'sms'
    let deliveryMethod: string
    let deliveryValue: string

    // If user has a preferred method, try to use it
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
        return { success: false, message: 'Email requis pour l\'envoi du code par email' }
      } else if (preferredMethod === 'sms' && !isPhone) {
        return { success: false, message: 'Numéro de téléphone requis pour l\'envoi du code par SMS' }
      } else {
        return { success: false, message: 'Méthode d\'envoi non disponible' }
      }
    } else {
      // Fallback to original logic if no preferred method specified
      if (isEmail && isPhone) {
        // Both email and phone provided - prioritize SMS for better mobile UX
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
        return { success: false, message: 'Format d\'email ou numéro de téléphone invalide' }
      }
    }

    // Generate and store OTP
    try {
      if (registrationSessionId) {
        // For registration sessions
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        await prisma.otpCode.create({
          data: {
            userId: null,
            registrationSessionId,
            code: otp,
            type: otpType === 'email' ? 'EMAIL' : 'SMS',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
          }
        })

        // Send OTP
        if (otpType === 'email') {
          await sendEmailOTP(deliveryValue, otp)
        } else {
          await sendSMSOTP(deliveryValue, otp)
        }
      } else {
        // For existing users - use the original generateOTP function
        const otp = await generateOTP(user!.id, otpType)

        // Send OTP
        if (otpType === 'email') {
          await sendEmailOTP(deliveryValue, otp)
        } else {
          await sendSMSOTP(deliveryValue, otp)
        }
      }

      return {
        success: true,
        message: `Code OTP envoyé par ${deliveryMethod}`
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      return { success: false, message: 'Erreur lors de l\'envoi du code OTP' }
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du code OTP:', error)
    return { 
      success: false, 
      message: 'Échec de l\'envoi du code OTP. Veuillez réessayer.' 
    }
  }
}

export async function cleanupExpiredOTPs(): Promise<void> {
  // Clean up expired OTP codes (run this periodically)
  await prisma.otpCode.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  })
}
