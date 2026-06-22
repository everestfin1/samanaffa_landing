import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { and, count, desc, eq, SQL } from 'drizzle-orm'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { adminUsers, notifications, users } from '@/lib/db/schema'
import type { NotificationType } from '@/lib/types'

function buildNotificationFilter(
  userId: string,
  status: string | null,
  type: string | null,
): SQL | undefined {
  const conditions: SQL[] = [eq(notifications.userId, userId)]

  if (status && status !== 'all') {
    conditions.push(eq(notifications.isRead, status === 'read'))
  }

  if (type) {
    conditions.push(eq(notifications.type, type.toUpperCase() as NotificationType))
  }

  return and(...conditions)
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const skip = (page - 1) * limit
    const where = buildNotificationFilter(session.user.id, status, type)

    const [rows, totalResult, unreadResult] = await Promise.all([
      db
        .select({
          id: notifications.id,
          title: notifications.title,
          message: notifications.message,
          type: notifications.type,
          isRead: notifications.isRead,
          priority: notifications.priority,
          metadata: notifications.metadata,
          createdAt: notifications.createdAt,
          updatedAt: notifications.updatedAt,
        })
        .from(notifications)
        .where(where)
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(skip),
      db.select({ total: count() }).from(notifications).where(where),
      db
        .select({ total: count() })
        .from(notifications)
        .where(
          and(eq(notifications.userId, session.user.id), eq(notifications.isRead, false)),
        ),
    ])

    const totalCount = Number(totalResult[0]?.total ?? 0)
    const unreadCount = Number(unreadResult[0]?.total ?? 0)

    return NextResponse.json({
      success: true,
      data: {
        notifications: rows,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
        },
        unreadCount,
      },
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const [adminUser] = await db
      .select({ id: adminUsers.id })
      .from(adminUsers)
      .where(eq(adminUsers.email, session.user.email!))
      .limit(1)

    if (!adminUser) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, title, message, type, priority, metadata } = body

    if (!userId || !title || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const [notification] = await db
      .insert(notifications)
      .values({
        userId,
        title,
        message,
        type: (type || 'SUCCESS') as NotificationType,
        priority: priority || 'NORMAL',
        metadata: metadata ? JSON.stringify(metadata) : null,
      })
      .returning()

    return NextResponse.json({
      success: true,
      data: notification,
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 },
    )
  }
}
