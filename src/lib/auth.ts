import { NextAuthOptions, User } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { generateOTP, verifyOTP } from './otp'
import { normalizeSenegalPhone } from './utils'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'otp',
      credentials: {
        email: { label: 'Email', type: 'email' },
        phone: { label: 'Phone', type: 'text' },
        otp: { label: 'OTP Code', type: 'text' },
        type: { label: 'Type', type: 'text' } // 'login' or 'register'
      },
      async authorize(credentials) {
        if (!credentials?.email && !credentials?.phone) {
          throw new Error('Email or phone is required')
        }

        if (!credentials?.otp) {
          throw new Error('OTP code is required')
        }

        // Normalize phone number if provided
        const normalizedPhone = credentials.phone ? normalizeSenegalPhone(credentials.phone) : null
        // console.log('🔍 NextAuth authorize:', { email: credentials.email, phone: credentials.phone, normalizedPhone })

        // Find user - try multiple phone formats for better compatibility
        let user = null

        if (credentials.email) {
          // First try email lookup
          user = await prisma.user.findFirst({
            where: { email: credentials.email }
          })
          // console.log('🔍 NextAuth email lookup result:', { email: credentials.email, found: !!user })
        }

        if (!user && normalizedPhone) {
          // Try multiple phone number formats for lookup
          const phoneFormats = [
            normalizedPhone, // normalized format (should be +221XXXXXXXXX)
            normalizedPhone.replace('+221', ''), // without country code
            normalizedPhone.replace('+', ''), // without + sign
            `+221${normalizedPhone.replace('+221', '')}`, // ensure +221 prefix
          ].filter((format, index, arr) => arr.indexOf(format) === index) // remove duplicates

          // console.log('🔍 NextAuth phone lookup formats to try:', phoneFormats)

          for (const phoneFormat of phoneFormats) {
            user = await prisma.user.findFirst({
              where: { phone: phoneFormat }
            })
            // console.log('🔍 NextAuth phone lookup attempt:', { format: phoneFormat, found: !!user })

            if (user) {
              // console.log('✅ NextAuth user found with phone format:', phoneFormat)
              break
            }
          }
        }

        if (!user) {
          throw new Error('User not found')
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

        // For login type, verify OTP
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
