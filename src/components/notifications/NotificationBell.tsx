'use client'

import { useState, useRef, useEffect } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { useNotifications } from '@/hooks/useNotifications'
import NotificationDropdown from './NotificationDropdown'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { unreadCount, notifications, markAsRead, markAllAsRead, getNotificationIcon, getNotificationColor } = useNotifications()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gold-metallic transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold-metallic focus:ring-opacity-50 rounded-lg"
        aria-label="Notifications"
      >
        <BellIcon className="w-6 h-6" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={markAllAsRead}
          onClose={() => setIsOpen(false)}
          getNotificationIcon={getNotificationIcon}
          getNotificationColor={getNotificationColor}
        />
      )}
    </div>
  )
}
