import { useState, useEffect, useCallback } from 'react'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'KYC_STATUS' | 'TRANSACTION' | 'SYSTEM'
  status: 'UNREAD' | 'READ' | 'ARCHIVED'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  metadata?: string
  readAt?: string
  createdAt: string
  updatedAt: string
}

export interface NotificationResponse {
  notifications: Notification[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  unreadCount: number
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async (params?: {
    page?: number
    limit?: number
    status?: string
    type?: string
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()
      
      if (params?.page) searchParams.set('page', params.page.toString())
      if (params?.limit) searchParams.set('limit', params.limit.toString())
      if (params?.status) searchParams.set('status', params.status)
      if (params?.type) searchParams.set('type', params.type)

      const response = await fetch(`/api/notifications?${searchParams.toString()}`)
      const data = await response.json()

      if (data.success) {
        setNotifications(data.data.notifications)
        setUnreadCount(data.data.unreadCount)
      } else {
        setError(data.error || 'Failed to fetch notifications')
      }
    } catch (err) {
      setError('Network error')
      console.error('Error fetching notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'READ',
          readAt: true
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, status: 'READ', readAt: new Date().toISOString() }
              : notification
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter(n => n.status === 'UNREAD')
      
      await Promise.all(
        unreadNotifications.map(notification => 
          fetch(`/api/notifications/${notification.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'READ',
              readAt: true
            })
          })
        )
      )

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.status === 'UNREAD'
            ? { ...notification, status: 'READ', readAt: new Date().toISOString() }
            : notification
        )
      )
      setUnreadCount(0)
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }, [notifications])

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        
        // Update unread count if notification was unread
        const deletedNotification = notifications.find(n => n.id === notificationId)
        if (deletedNotification?.status === 'UNREAD') {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }, [notifications])

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'SUCCESS':
        return '✅'
      case 'ERROR':
        return '❌'
      case 'WARNING':
        return '⚠️'
      case 'KYC_STATUS':
        return '📋'
      case 'TRANSACTION':
        return '💰'
      case 'SYSTEM':
        return '⚙️'
      default:
        return 'ℹ️'
    }
  }

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'URGENT') return 'text-red-600'
    if (priority === 'HIGH') return 'text-orange-600'
    
    switch (type) {
      case 'SUCCESS':
        return 'text-green-600'
      case 'ERROR':
        return 'text-red-600'
      case 'WARNING':
        return 'text-yellow-600'
      case 'KYC_STATUS':
        return 'text-blue-600'
      case 'TRANSACTION':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  // Auto-fetch notifications on mount
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationIcon,
    getNotificationColor
  }
}
