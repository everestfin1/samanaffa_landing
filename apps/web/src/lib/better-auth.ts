import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'
import * as authSchema from './db/auth-schema'

 const authSecret =
   process.env.BETTER_AUTH_SECRET ||
   process.env.ADMIN_SESSION_SECRET ||
   process.env.NEXTAUTH_SECRET

export const auth = betterAuth({
  secret: authSecret || 'dev-secret',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: authSchema.user,
      session: authSchema.session,
      account: authSchema.account,
      verification: authSchema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    // Use password_hash column for password storage
    password: {
      hash: async (password) => {
        const bcrypt = await import('bcryptjs')
        return bcrypt.default.hash(password, 10)
      },
      verify: async (data) => {
        const bcrypt = await import('bcryptjs')
        return bcrypt.default.compare(data.password, data.hash)
      },
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      phone: { type: 'string', required: false },
      firstName: { type: 'string', required: false, fieldName: 'first_name' },
      lastName: { type: 'string', required: false, fieldName: 'last_name' },
      kycStatus: { type: 'string', required: false, fieldName: 'kyc_status' },
    },
  },
})

// verifyCredentials is deprecated - use better-auth native endpoints instead
// Keeping for backwards compatibility during migration

export type Auth = typeof auth
