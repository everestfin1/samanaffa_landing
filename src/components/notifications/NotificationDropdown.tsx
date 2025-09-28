'use client'

import { useState } from 'react'
import { Notification } from '@/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'

interface NotificationDropdownProps {
  notifications: Notification[]
  unreadCount: number
  onNotificationClick: (notificationId: string) => void
  onMarkAllAsRead: () => void
  onClose: () => void
  getNotificationIcon: (type: Notification['type']) => string
  getNotificationColor: (type: Notification['type'], priority: Notification['priority']) => string
}

export default function NotificationDropdown({
  notifications,
  unreadCount,
  onNotificationClick,
  onMarkAllAsRead,
  onClose,
  getNotificationIcon,
  getNotificationColor
}: NotificationDropdownProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') {
      return notification.status === 'UNREAD'
    }
    return true
  })

  const handleNotificationClick = (notification: Notification) => {
    if (notification.status === 'UNREAD') {
      onNotificationClick(notification.id)
    }
    onClose()
  }

  const getActionUrl = (notification: Notification) => {
    const metadata = notification.metadata ? JSON.parse(notification.metadata) : null
    
    if (notification.type === 'KYC_STATUS') {
      return '/portal/profile'
    }
    
    if (notification.type === 'TRANSACTION') {
      return '/portal/dashboard'
    }
    
    return null
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({unreadCount} non lues)
              </span>
            )}
          </h3>
          
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-sm text-gold-metallic hover:text-gold-dark transition-colors"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex mt-3 space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 text-sm py-1 px-3 rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 text-sm py-1 px-3 rounded-md transition-colors ${
              filter === 'unread'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Non lues
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔔</span>
            </div>
            <p className="text-sm">
              {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.slice(0, 10).map((notification) => {
              const actionUrl = getActionUrl(notification)
              const isUnread = notification.status === 'UNREAD'
              
              const NotificationContent = () => (
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-lg">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className={`text-sm font-medium ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        {isUnread && (
                          <div className="w-2 h-2 bg-gold-metallic rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </span>
                        
                        <span className={`text-xs font-medium ${getNotificationColor(notification.type, notification.priority)}`}>
                          {notification.priority === 'URGENT' && 'Urgent'}
                          {notification.priority === 'HIGH' && 'Important'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )

              if (actionUrl) {
                return (
                  <Link
                    key={notification.id}
                    href={actionUrl}
                    onClick={() => handleNotificationClick(notification)}
                    className="block"
                  >
                    <NotificationContent />
                  </Link>
                )
              }

              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="block w-full text-left"
                >
                  <NotificationContent />
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <Link
          href="/portal/notifications"
          onClick={onClose}
          className="block w-full text-center text-sm text-gold-metallic hover:text-gold-dark transition-colors font-medium"
        >
          Voir toutes les notifications
        </Link>
      </div>
    </div>
  )
}
