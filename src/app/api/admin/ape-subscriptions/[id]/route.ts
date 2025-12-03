import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { apeSubscriptions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Verify admin token
async function verifyAdminToken(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return false
  }
  const token = authHeader.substring(7)
  // Simple token validation - in production, verify JWT properly
  return token.length > 0
}

// PATCH - Update APE subscription status (for manual reconciliation)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthorized = await verifyAdminToken(request)
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, providerTransactionId, adminNotes } = body

    // Validate status
    const validStatuses = ['PENDING', 'PAYMENT_INITIATED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'CANCELLED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status', validStatuses },
        { status: 400 }
      )
    }

    // Find the subscription
    const [existingSubscription] = await db
      .select()
      .from(apeSubscriptions)
      .where(eq(apeSubscriptions.id, id))
      .limit(1)

    if (!existingSubscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Build update object
    const updateData: Partial<typeof apeSubscriptions.$inferInsert> = {
      updatedAt: new Date(),
    }

    if (status) {
      updateData.status = status
      
      // Set payment completion timestamp if status is terminal
      if (status === 'PAYMENT_SUCCESS' || status === 'PAYMENT_FAILED') {
        if (!existingSubscription.paymentCompletedAt) {
          updateData.paymentCompletedAt = new Date()
        }
      }
    }

    if (providerTransactionId !== undefined) {
      updateData.providerTransactionId = providerTransactionId || null
    }

    // Store admin notes in the callback payload for audit trail
    if (adminNotes) {
      const existingPayload = (existingSubscription.paymentCallbackPayload as Record<string, unknown>) || {}
      updateData.paymentCallbackPayload = {
        ...existingPayload,
        adminUpdates: [
          ...((existingPayload.adminUpdates as unknown[]) || []),
          {
            timestamp: new Date().toISOString(),
            previousStatus: existingSubscription.status,
            newStatus: status,
            notes: adminNotes,
            providerTransactionId,
          }
        ]
      }
    }

    // Update the subscription
    const [updatedSubscription] = await db
      .update(apeSubscriptions)
      .set(updateData)
      .where(eq(apeSubscriptions.id, id))
      .returning()

    console.log('[Admin APE] Subscription status updated:', {
      id,
      previousStatus: existingSubscription.status,
      newStatus: status,
      providerTransactionId,
      adminNotes: adminNotes ? 'provided' : 'none',
    })

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
      message: `Statut mis à jour: ${existingSubscription.status} → ${status}`,
    })
  } catch (error) {
    console.error('[Admin APE] Error updating subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get single APE subscription details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthorized = await verifyAdminToken(request)
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const [subscription] = await db
      .select()
      .from(apeSubscriptions)
      .where(eq(apeSubscriptions.id, id))
      .limit(1)

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription,
    })
  } catch (error) {
    console.error('[Admin APE] Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
