import { NextAuthOptions, User } from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from './db'
import { prisma } from './prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyOTPWithRateLimitByKey } from './otp'
import { consumePostSignupToken } from './post-signup-token'
import { normalizeInternationalPhone, generatePhoneFormats } from './utils'
import bcrypt from 'bcryptjs'
import type { User as PrismaUser } from './db/schema'

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
        otp: { label: 'OTP Code', type: 'text' },
        postSignupToken: { label: 'Post-signup token', type: 'text' },
        type: { label: 'Type', type: 'text' } // 'login' | 'post_signup'
      },
      async authorize(credentials) {
        if (credentials?.type === 'post_signup' && credentials.postSignupToken) {
          const userId = await consumePostSignupToken(credentials.postSignupToken)
          if (!userId) {
            throw new Error('Invalid or expired signup session')
          }
          const signupUser = await prisma.user.findUnique({ where: { id: userId } })
          if (!signupUser) {
            throw new Error('User not found')
          }
          return {
            id: signupUser.id,
            email: signupUser.email,
            name: `${signupUser.firstName} ${signupUser.lastName}`,
          }
        }

        if (!credentials?.email && !credentials?.phone) {
          throw new Error('Email or phone is required')
        }

        // Normalize phone number if provided
        const normalizedPhone = credentials.phone ? normalizeInternationalPhone(credentials.phone) : null

        // Find user - try multiple phone formats for better compatibility
        let user: PrismaUser | null = null

        if (credentials.email) {
          // First try email lookup
          user = await prisma.user.findFirst({
            where: { email: credentials.email }
          })
        }

        if (!user && normalizedPhone) {
          // Try multiple phone number formats for lookup
          const phoneFormats = generatePhoneFormats(normalizedPhone)

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
          const verifyResult = await verifyOTPWithRateLimitByKey(user.id, credentials.otp)
          if (verifyResult.success === false) {
            if (verifyResult.error === 'rate_limited') {
              throw new Error('Trop de tentatives. Réessayez plus tard.')
            }
            throw new Error('Invalid OTP code')
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          }
        }

        if (credentials.type === 'register') {
          throw new Error('Registration sign-in is no longer supported; use post_signup token')
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
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        // Fetch full user data to include in token
        const fullUser = await prisma.user.findUnique({
          where: { id: user.id }
        });
        if (fullUser) {
          token.phone = fullUser.phone
          token.firstName = fullUser.firstName
          token.lastName = fullUser.lastName
          token.email = fullUser.email
        }
      }
      
      // Refresh user data on session update
      if (trigger === 'update' && token.id) {
        const fullUser = await prisma.user.findUnique({
          where: { id: token.id as string }
        });
        if (fullUser) {
          token.phone = fullUser.phone
          token.firstName = fullUser.firstName
          token.lastName = fullUser.lastName
          token.email = fullUser.email
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as User & { 
          id: string;
          phone?: string;
          firstName?: string;
          lastName?: string;
        }).id = token.id as string;
        (session.user as any).phone = token.phone;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
        
        // Update email if available from token
        if (token.email) {
          session.user.email = token.email as string;
        }
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
