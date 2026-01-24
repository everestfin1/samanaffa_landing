import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/get-session'
import { db } from '@/lib/db'
import { notifications, users, adminUsers } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(request)
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') // 'unread', 'read', 'all'
    const type = searchParams.get('type') // notification type filter

    const skip = (page - 1) * limit

    // Build where clause
    const conditions = [eq(notifications.userId, session.user.id)]

    if (status && status !== 'all') {
      conditions.push(eq(notifications.isRead, status === 'read'))
    }

    if (type) {
      conditions.push(eq(notifications.type, type.toUpperCase() as any))
    }

    const whereClause = and(...conditions)

    const [notificationsData, totalCount] = await Promise.all([
      db
        .select()
        .from(notifications)
        .where(whereClause)
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(skip),
      db
        .select({ count: notifications.id })
        .from(notifications)
        .where(whereClause)
        .then(result => result[0]?.count || 0)
    ])

    // Get unread count
    const unreadCountResult = await db
      .select({ count: notifications.id })
      .from(notifications)
      .where(and(
        eq(notifications.userId, session.user.id),
        eq(notifications.isRead, false)
      ))
    const unreadCount = unreadCountResult[0]?.count || 0

    return NextResponse.json({
      success: true,
      data: {
        notifications: notificationsData,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(Number(totalCount) / limit) || 1
        },
        unreadCount
      }
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Create notification (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(request)
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminUser = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, session.user.email!))
      .limit(1)

    if (!adminUser || adminUser.length === 0) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, title, message, type, priority, metadata } = body

    if (!userId || !title || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user || user.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const notification = await db
      .insert(notifications)
      .values({
        userId,
        title,
        message,
        type: type || 'INFO',
        priority: priority || 'NORMAL',
        metadata: metadata ? JSON.stringify(metadata) : null
      })
      .returning()

    return NextResponse.json({
      success: true,
      data: notification[0]
    })

  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}
