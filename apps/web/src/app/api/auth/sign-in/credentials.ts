import { createFileRoute } from '@tanstack/react-router'
import { verifyCredentials } from '@/lib/auth-utils'
import { getDb } from '@/lib/db'
import { sessions } from '@/lib/db/schema'

export const Route = createFileRoute('/api/auth/sign-in/credentials')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const db = getDb()
          const body = await request.json()
          const { email, phone, password, otp, type } = body ?? {}

          const user = await verifyCredentials({
            email,
            phone,
            password,
            otp,
            type,
          })

          const sessionToken = crypto.randomUUID()
          const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

          await db.insert(sessions).values({
            id: crypto.randomUUID(),
            sessionToken,
            userId: user.id,
            expires,
          })

          const response = Response.json({
            success: true,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              phone: user.phone,
              firstName: user.firstName,
              lastName: user.lastName,
              kycStatus: user.kycStatus,
            },
          })

          response.headers.append(
            'Set-Cookie',
            `better-auth.session_token=${encodeURIComponent(sessionToken)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`,
          )

          return response
        } catch (error: any) {
          console.error('[api/auth/sign-in/credentials] Error:', error)
          return Response.json(
            { success: false, error: error?.message ?? 'Authentication failed' },
            { status: 401 },
          )
        }
      },
    },
  },
})
