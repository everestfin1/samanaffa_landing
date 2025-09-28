'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PortalHeader from '@/components/portal/PortalHeader'
import { useNotifications } from '@/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { 
  BellIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  userId: string
  isNewUser: boolean
  kycStatus: KYCStatus
}

export default function NotificationsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [page, setPage] = useState(1)

  const {
    notifications,
    unreadCount,
    isLoading: notificationsLoading,
    error: notificationsError,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationIcon,
    getNotificationColor
  } = useNotifications()

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'loading') return
      
      if (!session) {
        router.push('/login')
        return
      }

      try {
        const profileResponse = await fetch('/api/users/profile')
        const profileData = await profileResponse.json()

        if (profileData.success) {
          setUserData({
            id: profileData.user.id,
            userId: profileData.user.id,
            firstName: profileData.user.firstName,
            lastName: profileData.user.lastName,
            email: profileData.user.email,
            phone: profileData.user.phone,
            kycStatus: profileData.user.kycStatus,
            isNewUser: profileData.user.isNewUser || false,
          })
        } else {
          setError('Erreur lors du chargement des données')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Erreur de connexion')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [session, status, router])

  // Fetch notifications when filter changes
  useEffect(() => {
    if (userData) {
      fetchNotifications({
        page,
        limit: 20,
        status: filter === 'unread' ? 'unread' : 'all'
      })
    }
  }, [userData, filter, page, fetchNotifications])

  const handleLogout = () => {
    router.push('/login')
  }

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId)
  }

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId)
  }

  const getActionUrl = (notification: any) => {
    const metadata = notification.metadata ? JSON.parse(notification.metadata) : null
    
    if (notification.type === 'KYC_STATUS') {
      return '/portal/profile'
    }
    
    if (notification.type === 'TRANSACTION') {
      return '/portal/dashboard'
    }
    
    return null
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') {
      return notification.status === 'UNREAD'
    }
    return true
  })

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-night/70">Chargement des notifications...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-night/70 mb-4">Erreur lors du chargement des notifications</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gold-metallic text-white px-6 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-light">
      <PortalHeader
        userData={userData}
        kycStatus={userData.kycStatus}
        activeTab="notifications"
        setActiveTab={() => {}} // Not used with navigation
        onLogout={handleLogout}
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-night">Notifications</h1>
              <p className="text-night/70 mt-1">
                {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Aucune notification non lue'}
              </p>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-gold-metallic text-white px-4 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 text-sm py-2 px-4 rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-gold-metallic text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Toutes ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 text-sm py-2 px-4 rounded-md transition-colors ${
                filter === 'unread'
                  ? 'bg-gold-metallic text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Non lues ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {notificationsLoading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-gold-metallic border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Chargement des notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BellIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
                </h3>
                <p className="text-gray-500">
                  {filter === 'unread' 
                    ? 'Vous avez lu toutes vos notifications' 
                    : 'Vous n\'avez pas encore de notifications'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => {
                  const isUnread = notification.status === 'UNREAD'
                  const actionUrl = getActionUrl(notification)
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-6 hover:bg-gray-50 transition-colors ${
                        isUnread ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">
                            {getNotificationIcon(notification.type)}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className={`text-lg font-medium ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h3>
                                {isUnread && (
                                  <div className="w-2 h-2 bg-gold-metallic rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                              
                              <p className="text-gray-600 mt-1 leading-relaxed">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-sm text-gray-500">
                                  {formatDistanceToNow(new Date(notification.createdAt), {
                                    addSuffix: true,
                                    locale: fr
                                  })}
                                </span>
                                
                                <div className="flex items-center space-x-2">
                                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
                                    {notification.priority === 'URGENT' && 'Urgent'}
                                    {notification.priority === 'HIGH' && 'Important'}
                                  </span>
                                  
                                  {isUnread && (
                                    <button
                                      onClick={() => handleNotificationClick(notification.id)}
                                      className="text-xs text-gold-metallic hover:text-gold-dark transition-colors"
                                    >
                                      Marquer comme lu
                                    </button>
                                  )}
                                  
                                  <button
                                    onClick={() => handleDeleteNotification(notification.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Error State */}
          {notificationsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{notificationsError}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}