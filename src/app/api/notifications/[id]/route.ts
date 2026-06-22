import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { and, eq } from 'drizzle-orm'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const [notification] = await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.id, id), eq(notifications.userId, session.user.id)))
      .limit(1)

    if (!notification) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: notification,
    })
  } catch (error) {
    console.error('Error fetching notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notification' },
      { status: 500 },
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { readAt } = body

    const [existingNotification] = await db
      .select({ id: notifications.id })
      .from(notifications)
      .where(and(eq(notifications.id, id), eq(notifications.userId, session.user.id)))
      .limit(1)

    if (!existingNotification) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 },
      )
    }

    const updateData: Partial<typeof notifications.$inferInsert> = {}

    if (readAt !== undefined) {
      updateData.isRead = Boolean(readAt)
    }

    if (Object.keys(updateData).length === 0) {
      const [current] = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, id))
        .limit(1)
      return NextResponse.json({ success: true, data: current })
    }

    const [notification] = await db
      .update(notifications)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(notifications.id, id))
      .returning()

    return NextResponse.json({
      success: true,
      data: notification,
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update notification' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const [existingNotification] = await db
      .select({ id: notifications.id })
      .from(notifications)
      .where(and(eq(notifications.id, id), eq(notifications.userId, session.user.id)))
      .limit(1)

    if (!existingNotification) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 },
      )
    }

    await db.delete(notifications).where(eq(notifications.id, id))

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete notification' },
      { status: 500 },
    )
  }
}
