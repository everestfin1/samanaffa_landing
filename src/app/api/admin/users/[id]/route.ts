import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { userAccounts, users } from '@/lib/db/schema'
import type { AccountStatus } from '@/lib/types'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'
import { logUserSuspension, logUserActivation } from '@/lib/audit-logger'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const { error, user } = await verifyAdminAuth(request)
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401)
  }

  try {
    const { id } = await params
    const { action, reason } = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    // Validate action
    const validActions = ['suspend', 'activate']
    if (!validActions.includes(action.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "suspend" or "activate"' },
        { status: 400 }
      )
    }

    // Check if user exists
    const [targetUser] = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const isSuspending = action.toLowerCase() === 'suspend'

    if (isSuspending && !reason) {
      return NextResponse.json(
        { error: 'Reason is required for suspension' },
        { status: 400 }
      )
    }

    const accountStatus: AccountStatus = isSuspending ? 'SUSPENDED' : 'ACTIVE'
    const suspendedAt = isSuspending ? new Date() : null

    await db
      .update(userAccounts)
      .set({ status: accountStatus })
      .where(eq(userAccounts.userId, id))

    await db
      .update(users)
      .set({ updatedAt: new Date() })
      .where(eq(users.id, id))

    if (isSuspending) {
      await logUserSuspension(user.id, id, reason, request)
    } else {
      await logUserActivation(user.id, id, request)
    }

    return NextResponse.json({
      success: true,
      message: `User ${isSuspending ? 'suspended' : 'activated'} successfully`,
      user: {
        id: targetUser.id,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        email: targetUser.email,
        phone: targetUser.phone,
        isActive: !isSuspending,
        suspendedAt,
        suspensionReason: isSuspending ? reason : null,
      },
    })

  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
