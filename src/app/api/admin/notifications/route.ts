import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { and, count, desc, eq, SQL } from 'drizzle-orm'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { adminUsers, notifications, users } from '@/lib/db/schema'
import { sendKYCStatusEmail, sendKYCStatusSMS } from '@/lib/notifications'
import { NotificationPriority, NotificationType, KycStatus } from '@/lib/types'

function buildAdminNotificationFilter(
  userId: string | null,
  status: string | null,
  type: string | null,
): SQL | undefined {
  const conditions: SQL[] = []

  if (userId) {
    conditions.push(eq(notifications.userId, userId))
  }

  if (status && status !== 'all') {
    const normalized = status.toUpperCase()
    if (normalized === 'READ') {
      conditions.push(eq(notifications.isRead, true))
    } else if (normalized === 'UNREAD') {
      conditions.push(eq(notifications.isRead, false))
    }
  }

  if (type) {
    conditions.push(eq(notifications.type, type.toUpperCase() as NotificationType))
  }

  return conditions.length > 0 ? and(...conditions) : undefined
}

// GET /api/admin/notifications - Get all notifications (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const [adminUser] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, session.user.email))
      .limit(1)

    if (!adminUser) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const skip = (page - 1) * limit
    const where = buildAdminNotificationFilter(userId, status, type)

    const [rows, totalResult] = await Promise.all([
      db
        .select({
          id: notifications.id,
          userId: notifications.userId,
          title: notifications.title,
          message: notifications.message,
          type: notifications.type,
          priority: notifications.priority,
          isRead: notifications.isRead,
          metadata: notifications.metadata,
          createdAt: notifications.createdAt,
          updatedAt: notifications.updatedAt,
          userFirstName: users.firstName,
          userLastName: users.lastName,
          userEmail: users.email,
          userPhone: users.phone,
        })
        .from(notifications)
        .innerJoin(users, eq(notifications.userId, users.id))
        .where(where)
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(skip),
      db
        .select({ total: count() })
        .from(notifications)
        .where(where),
    ])

    const totalCount = Number(totalResult[0]?.total ?? 0)

    return NextResponse.json({
      success: true,
      data: {
        notifications: rows.map((row) => ({
          id: row.id,
          userId: row.userId,
          title: row.title,
          message: row.message,
          type: row.type,
          priority: row.priority,
          isRead: row.isRead,
          metadata: row.metadata,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          user: {
            id: row.userId,
            firstName: row.userFirstName,
            lastName: row.userLastName,
            email: row.userEmail,
            phone: row.userPhone,
          },
        })),
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
        },
      },
    })

  } catch (error) {
    console.error('Error fetching admin notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST /api/admin/notifications - Send KYC status notification
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const [adminUser] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, session.user.email))
      .limit(1)

    if (!adminUser) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { 
      userId, 
      kycStatus, 
      rejectionReasons, 
      sendEmail = true, 
      sendSMS = true,
      customMessage 
    } = body

    if (!userId || !kycStatus) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const [user] = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
        kycStatus: users.kycStatus,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    await db
      .update(users)
      .set({ kycStatus: kycStatus as KycStatus })
      .where(eq(users.id, userId))

    let title = ''
    let message = ''
    let notificationType: NotificationType = 'KYC_STATUS'
    let priority: NotificationPriority = 'NORMAL'

    switch (kycStatus) {
      case 'APPROVED':
        title = 'KYC Approuvé'
        message = customMessage || 'Félicitations ! Votre dossier KYC a été approuvé avec succès.'
        notificationType = 'SUCCESS'
        priority = 'HIGH'
        break
      case 'REJECTED':
        title = 'KYC Rejeté'
        message = customMessage || 'Votre dossier KYC nécessite des corrections. Veuillez consulter les détails.'
        notificationType = 'ERROR'
        priority = 'HIGH'
        break
      case 'UNDER_REVIEW':
        title = 'KYC En Révision'
        message = customMessage || 'Votre dossier KYC est actuellement en cours de révision.'
        notificationType = 'WARNING'
        priority = 'NORMAL'
        break
    }

    const [notification] = await db
      .insert(notifications)
      .values({
        userId,
        title,
        message,
        type: notificationType,
        priority,
        metadata: JSON.stringify({
          kycStatus,
          rejectionReasons,
          adminId: adminUser.id,
          adminName: adminUser.name,
        }),
      })
      .returning()

    if (sendEmail) {
      try {
        await sendKYCStatusEmail(
          user.email,
          `${user.firstName} ${user.lastName}`,
          kycStatus,
          rejectionReasons
        )
      } catch (error) {
        console.error('Error sending KYC status email:', error)
      }
    }

    if (sendSMS) {
      try {
        await sendKYCStatusSMS(user.phone, kycStatus)
      } catch (error) {
        console.error('Error sending KYC status SMS:', error)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        notification,
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          kycStatus,
        },
      },
    })

  } catch (error) {
    console.error('Error sending KYC notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
