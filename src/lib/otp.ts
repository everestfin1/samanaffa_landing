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

    // Find user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : [])
        ]
      }
    })

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

    // Generate OTP
    const otp = await generateOTP(user.id, email ? 'email' : 'sms')

    // Send OTP
    if (email) {
      await sendEmailOTP(email, otp)
    } else if (phone) {
      await sendSMSOTP(phone, otp)
    }

    return { 
      success: true, 
      message: `Code OTP envoyé par ${email ? 'email' : 'SMS'}` 
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
