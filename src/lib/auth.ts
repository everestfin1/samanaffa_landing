import { NextAuthOptions, User } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { generateOTP, verifyOTP } from './otp'
import { normalizeInternationalPhone } from './utils'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
        otp: { label: 'OTP Code', type: 'text' },
        type: { label: 'Type', type: 'text' } // 'login', 'register', or 'password_login'
      },
      async authorize(credentials) {
        if (!credentials?.email && !credentials?.phone) {
          throw new Error('Email or phone is required')
        }

        // Normalize phone number if provided
        const normalizedPhone = credentials.phone ? normalizeInternationalPhone(credentials.phone) : null

        // Find user - try multiple phone formats for better compatibility
        let user = null

        if (credentials.email) {
          // First try email lookup
          user = await prisma.user.findFirst({
            where: { email: credentials.email }
          })
        }

        if (!user && normalizedPhone) {
          // Try multiple phone number formats for lookup
          const phoneFormats = [
            normalizedPhone, // normalized format (should be +221XXXXXXXXX)
            normalizedPhone.replace('+221', ''), // without country code
            normalizedPhone.replace('+', ''), // without + sign
            `+221${normalizedPhone.replace('+221', '')}`, // ensure +221 prefix
          ].filter((format, index, arr) => arr.indexOf(format) === index) // remove duplicates

          for (const phoneFormat of phoneFormats) {
            user = await prisma.user.findFirst({
              where: { phone: phoneFormat }
            })

            if (user) {
              break
            }
          }
        }

        if (!user) {
          throw new Error('User not found')
        }

        // Handle password-based login
        if (credentials.type === 'login' && credentials.password) {
          if (!user.passwordHash) {
            throw new Error('Password not set for this account')
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)
          if (!isPasswordValid) {
            throw new Error('Invalid password')
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          }
        }

        // Handle OTP-based login (existing logic)
        if (credentials.type === 'login' && credentials.otp) {
          // Verify OTP
          const isValidOTP = await verifyOTP(user.id, credentials.otp)
          if (!isValidOTP) {
            throw new Error('Invalid OTP code')
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          }
        }

        // For registration type, skip OTP verification since it was already verified
        if (credentials.type === 'register') {
          // Just verify the user exists and is properly registered
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
          }
        }

        throw new Error('Invalid authentication method')
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as User & { id: string }).id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
