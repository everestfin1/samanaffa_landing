'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/common/Button'
import {
  Users,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Mail,
  MessageSquare
} from 'lucide-react'

interface User {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  kycStatus: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'
}

interface NotificationForm {
  userId: string
  kycStatus: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW'
  rejectionReasons: string[]
  customMessage: string
  sendEmail: boolean
  sendSMS: boolean
}

export default function NotificationManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')

  const [notificationForm, setNotificationForm] = useState<NotificationForm>({
    userId: '',
    kycStatus: 'APPROVED',
    rejectionReasons: [],
    customMessage: '',
    sendEmail: true,
    sendSMS: true
  })

  const commonRejectionReasons = [
    'Document de qualité insuffisante',
    'Document expiré',
    'Document non lisible',
    'Informations incomplètes',
    'Document manquant',
    'Photo de profil non conforme',
    'Signature manquante ou non valide',
    'Adresse non vérifiable',
    'Numéro de téléphone incorrect',
    'Informations contradictoires'
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [users, searchTerm])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setNotificationForm(prev => ({
      ...prev,
      userId: user.id,
      kycStatus: user.kycStatus === 'PENDING' ? 'UNDER_REVIEW' : user.kycStatus as any
    }))
  }

  const handleRejectionReasonToggle = (reason: string) => {
    setNotificationForm(prev => ({
      ...prev,
      rejectionReasons: prev.rejectionReasons.includes(reason)
        ? prev.rejectionReasons.filter(r => r !== reason)
        : [...prev.rejectionReasons, reason]
    }))
  }

  const handleSendNotification = async () => {
    if (!selectedUser || !notificationForm.kycStatus) {
      setMessage('Veuillez sélectionner un utilisateur et un statut')
      return
    }

    try {
      setSending(true)
      setMessage('')

      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationForm)
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage('Notification envoyée avec succès!')
        // Update user status in local state
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id 
            ? { ...user, kycStatus: notificationForm.kycStatus }
            : user
        ))
        // Reset form
        setSelectedUser(null)
        setNotificationForm({
          userId: '',
          kycStatus: 'APPROVED',
          rejectionReasons: [],
          customMessage: '',
          sendEmail: true,
          sendSMS: true
        })
      } else {
        setMessage(`Erreur: ${data.error}`)
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      setMessage('Erreur lors de l\'envoi de la notification')
    } finally {
      setSending(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'UNDER_REVIEW':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'REJECTED':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'UNDER_REVIEW':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* User Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Search and List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Sélectionner un utilisateur</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Users List */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Chargement...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Aucun utilisateur trouvé</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.kycStatus)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(user.kycStatus)}
                          <span>{user.kycStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Envoyer notification KYC</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <div className="space-y-4">
                {/* Selected User Info */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-sm">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                  <p className="text-xs text-gray-500">Status actuel: {selectedUser.kycStatus}</p>
                </div>

                {/* New Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau statut KYC
                  </label>
                  <select
                    value={notificationForm.kycStatus}
                    onChange={(e) => setNotificationForm(prev => ({
                      ...prev,
                      kycStatus: e.target.value as any
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="APPROVED">Approuvé</option>
                    <option value="REJECTED">Rejeté</option>
                    <option value="UNDER_REVIEW">En révision</option>
                  </select>
                </div>

                {/* Rejection Reasons */}
                {notificationForm.kycStatus === 'REJECTED' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Raisons du rejet
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {commonRejectionReasons.map((reason) => (
                        <label key={reason} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={notificationForm.rejectionReasons.includes(reason)}
                            onChange={() => handleRejectionReasonToggle(reason)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{reason}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message personnalisé (optionnel)
                  </label>
                  <textarea
                    value={notificationForm.customMessage}
                    onChange={(e) => setNotificationForm(prev => ({
                      ...prev,
                      customMessage: e.target.value
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Message personnalisé pour l'utilisateur..."
                  />
                </div>

                {/* Notification Options */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={notificationForm.sendEmail}
                      onChange={(e) => setNotificationForm(prev => ({
                        ...prev,
                        sendEmail: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Envoyer par email</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={notificationForm.sendSMS}
                      onChange={(e) => setNotificationForm(prev => ({
                        ...prev,
                        sendSMS: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Envoyer par SMS</span>
                  </label>
                </div>

                {/* Send Button */}
                <Button
                  onClick={handleSendNotification}
                  disabled={sending || (!notificationForm.sendEmail && !notificationForm.sendSMS)}
                  className="w-full"
                  variant={notificationForm.kycStatus === 'APPROVED' ? 'default' : 'destructive'}
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer notification
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">
                  Sélectionnez un utilisateur pour envoyer une notification
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('succès') 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  )
}
