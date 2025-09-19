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

export async function sendOTP(email?: string, phone?: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!email && !phone) {
      return { success: false, message: 'Email or phone is required' }
    }

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    })

    if (!user) {
      // For registration, we'll create a minimal user record
      // The full profile will be created after OTP verification
      if (!email || !phone) {
        return { success: false, message: 'Both email and phone are required for registration' }
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
      message: `OTP sent to ${email ? 'email' : 'phone'}` 
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    return { 
      success: false, 
      message: 'Failed to send OTP. Please try again.' 
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
