import { prisma } from './prisma'
import { sendEmailOTP, sendSMSOTP } from './notifications'

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

export async function verifyOTP(userId: string, code: string): Promise<boolean> {
  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      userId,
      code,
      used: false,
      expiresAt: {
        gt: new Date()
      }
    }
  })

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

export async function sendOTP(email?: string, phone?: string, type: 'login' | 'register' = 'login'): Promise<{ success: boolean; message: string }> {
  try {
    if (!email && !phone) {
      return { success: false, message: 'Email ou numéro de téléphone requis' }
    }

    // Find user - try multiple phone formats for better compatibility
    let user = null

    if (email) {
      // First try email lookup
      user = await prisma.user.findFirst({
        where: { email }
      })
      console.log('🔍 Email lookup result:', { email, found: !!user })
    }

    if (!user && phone) {
      // Try multiple phone number formats for lookup
      const phoneFormats = [
        phone, // normalized format (should be +221XXXXXXXXX)
        phone.replace('+221', ''), // without country code
        phone.replace('+', ''), // without + sign
        `+221${phone.replace('+221', '')}`, // ensure +221 prefix
      ].filter((format, index, arr) => arr.indexOf(format) === index) // remove duplicates

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
      
      // For registration: create user if both email and phone provided
      if (type === 'register') {
        if (!email || !phone) {
          return { success: false, message: 'Email et numéro de téléphone requis pour l\'inscription' }
        }

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

    // At this point, user should exist (either found or created)
    if (!user) {
      return { success: false, message: 'Échec du traitement de l\'utilisateur' }
    }

    // Determine OTP delivery method based on input format
    const isEmail = email && email.includes('@')
    const isPhone = phone && phone.startsWith('+')

    let otpType: 'email' | 'sms'
    let deliveryMethod: string
    let deliveryValue: string

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

    // Generate OTP
    const otp = await generateOTP(user.id, otpType)

    // Send OTP
    if (otpType === 'email') {
      await sendEmailOTP(deliveryValue, otp)
    } else {
      await sendSMSOTP(deliveryValue, otp)
    }

    return {
      success: true,
      message: `Code OTP envoyé par ${deliveryMethod}`
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
