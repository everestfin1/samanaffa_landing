import { prisma } from './prisma'
import { generateOTP, verifyOTP } from './otp'
import { normalizeInternationalPhone, generatePhoneFormats } from './utils'
import bcrypt from 'bcryptjs'
import type { User } from './db/schema'

// Custom credentials verification for existing flow compatibility
export async function verifyCredentials(credentials: {
  email?: string | null
  phone?: string | null
  password?: string
  otp?: string
  type: 'login' | 'register'
}) {
  const { email, phone, password, otp, type } = credentials

  if (!email && !phone) {
    throw new Error('Email or phone is required')
  }

  // Normalize phone number if provided
  const normalizedPhone = phone ? normalizeInternationalPhone(phone) : null

  // Find user - try multiple phone formats for better compatibility
  let user: User | null = null

  if (email) {
    user = await prisma.user.findFirst({
      where: { email }
    })
  }

  if (!user && normalizedPhone) {
    const phoneFormats = generatePhoneFormats(normalizedPhone)
    for (const phoneFormat of phoneFormats) {
      user = await prisma.user.findFirst({
        where: { phone: phoneFormat }
      })
      if (user) break
    }
  }

  if (!user) {
    throw new Error('User not found')
  }

  // Handle password-based login
  if (type === 'login' && password) {
    if (!user.passwordHash) {
      throw new Error('Password not set for this account')
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }
    return {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      kycStatus: user.kycStatus,
    }
  }

  // Handle OTP-based login
  if (type === 'login' && otp) {
    const isValidOTP = await verifyOTP(user.id, otp)
    if (!isValidOTP) {
      throw new Error('Invalid OTP code')
    }
    return {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      kycStatus: user.kycStatus,
    }
  }

  // For registration type
  if (type === 'register') {
    const accounts = await prisma.userAccount.findMany({
      where: { userId: user.id }
    })
    if (accounts.length < 2) {
      throw new Error('Registration incomplete')
    }
    return {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      kycStatus: user.kycStatus,
    }
  }

  throw new Error('Invalid authentication method')
}
