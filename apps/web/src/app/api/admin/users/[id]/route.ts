import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isActive: true,
        suspendedAt: true,
        suspensionReason: true
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let updatedUser
    const isSuspending = action.toLowerCase() === 'suspend'

    if (isSuspending) {
      // Suspend user
      if (!reason) {
        return NextResponse.json(
          { error: 'Reason is required for suspension' },
          { status: 400 }
        )
      }

      updatedUser = await prisma.user.update({
        where: { id },
        data: {
          isActive: false,
          suspendedAt: new Date(),
          suspensionReason: reason,
          updatedAt: new Date()
        }
      })

      // Log suspension
      await logUserSuspension(user.id, id, reason, request)
    } else {
      // Activate user
      updatedUser = await prisma.user.update({
        where: { id },
        data: {
          isActive: true,
          suspendedAt: null,
          suspensionReason: null,
          updatedAt: new Date()
        }
      })

      // Log activation
      await logUserActivation(user.id, id, request)
    }

    return NextResponse.json({
      success: true,
      message: `User ${isSuspending ? 'suspended' : 'activated'} successfully`,
      user: {
        id: updatedUser.id,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        email: targetUser.email,
        phone: targetUser.phone,
        isActive: updatedUser.isActive,
        suspendedAt: updatedUser.suspendedAt,
        suspensionReason: updatedUser.suspensionReason
      }
    })

  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
