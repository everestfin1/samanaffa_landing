import { NextAuthOptions, User } from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from './db'
import { sql } from 'drizzle-orm'
import { prisma } from './prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { generateOTP, verifyOTP } from './otp'
import { normalizeInternationalPhone, generatePhoneFormats } from './utils'
import { findLegacyAuthUser } from './legacy-auth-user'
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
        type: { label: 'Type', type: 'text' } // 'login', 'register', or 'password_login'
      },
      async authorize(credentials) {
        if (!credentials?.email && !credentials?.phone) {
          throw new Error('Email or phone is required')
        }

        // Normalize email and phone
        const normalizedEmail = credentials.email ? credentials.email.trim().toLowerCase() : null
        const normalizedPhone = credentials.phone ? normalizeInternationalPhone(credentials.phone) : null

        // Find user - try multiple phone formats for better compatibility
        let user: PrismaUser | null = null

        if (normalizedEmail) {
          // First try email lookup
          user = await prisma.user.findFirst({
            where: { email: normalizedEmail }
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

        // Fallback: look in legacy NextAuth user table
        if (!user && normalizedEmail) {
          user = await findLegacyAuthUser({ email: normalizedEmail })
        }

        if (!user) {
          throw new Error('User not found')
        }

        // Handle password-based login
        if (credentials.type === 'login' && credentials.password) {
          let passwordToCompare: string | null = user.passwordHash

          // For legacy users, check the account table for password
          if (!passwordToCompare) {
            try {
              const legacyAccountResult = await db.execute(sql`
                select password from "account"
                where "user_id" = ${user.id} and "provider_id" = 'credential'
                limit 1
              `)
              const legacyAccount = (legacyAccountResult as any).rows?.[0]
              passwordToCompare = legacyAccount?.password || null
            } catch (error) {
              console.log('❌ Error querying legacy account:', error)
              passwordToCompare = null
            }
          }

          if (!passwordToCompare) {
            throw new Error('Password not set for this account')
          }

          // For NextAuth legacy format (salt:hash), we need to extract the hash part
          let hashToCompare = passwordToCompare
          if (passwordToCompare.includes(':')) {
            const [, hashPart] = passwordToCompare.split(':')
            hashToCompare = hashPart
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, hashToCompare)
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
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        // Fetch full user data to include in token; fallback to legacy table
        let fullUser = await prisma.user.findUnique({ where: { id: user.id } })
        if (!fullUser) {
          fullUser = await findLegacyAuthUser({ id: user.id })
        }
        if (fullUser) {
          token.phone = fullUser.phone
          token.firstName = fullUser.firstName
          token.lastName = fullUser.lastName
          token.email = fullUser.email
        }
      }
      
      // Refresh user data on session update
      if (trigger === 'update' && token.id) {
        let fullUser = await prisma.user.findUnique({ where: { id: token.id as string } })
        if (!fullUser) {
          fullUser = await findLegacyAuthUser({ id: token.id as string })
        }
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
