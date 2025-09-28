import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendKYCStatusEmail, sendKYCStatusSMS } from '@/lib/notifications'
import { NotificationPriority, NotificationType } from '@prisma/client'

// GET /api/admin/notifications - Get all notifications (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: session.user.email! }
    })

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

    // Build where clause
    const where: any = {}
    
    if (userId) {
      where.userId = userId
    }
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }
    
    if (type) {
      where.type = type.toUpperCase()
    }

    const [notifications, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          }
        }
      }),
      prisma.notification.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      }
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

    // Check if user is admin
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: session.user.email! }
    })

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

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        kycStatus: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user KYC status
    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus }
    })

    // Create notification
    let title = ''
    let message = ''
    let notificationType = 'KYC_STATUS'
    let priority = 'NORMAL'

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

    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: notificationType as NotificationType,
        priority: priority as NotificationPriority,
        metadata: JSON.stringify({
          kycStatus,
          rejectionReasons,
          adminId: adminUser.id,
          adminName: adminUser.name
        })
      }
    })

    // Send email notification
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

    // Send SMS notification
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
          kycStatus
        }
      }
    })

  } catch (error) {
    console.error('Error sending KYC notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
