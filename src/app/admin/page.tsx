'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/common/Button'
import NotificationManagement from '@/components/admin/NotificationManagement'
import NotificationSettings from '@/components/admin/NotificationSettings'
import { 
  Users, 
  FileText, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  DollarSign,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle,
  FileImage,
  Download,
  MessageSquare,
  Trash2,
  Archive,
  UserCheck,
  UserX,
  Edit,
  Shield,
  Ban,
  RotateCcw
} from 'lucide-react'
import Image from 'next/image'

interface DashboardStats {
  totalUsers: number
  pendingKyc: number
  underReviewKyc: number
  pendingTransactions: number
  completedTransactions: number
  totalDeposits: number
  totalInvestments: number
}

interface User {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  kycStatus: string
  createdAt: string
  stats: {
    totalTransactions: number
    totalKycDocuments: number
  }
}

interface Transaction {
  id: string
  referenceNumber: string
  user: {
    name: string
    email: string
    phone: string
  }
  intentType: string
  amount: number
  status: string
  createdAt: string
}

interface KycDocument {
  id: string
  documentType: string
  fileName: string
  fileUrl: string
  uploadDate: string
  verificationStatus: string
  adminNotes?: string
  user: {
    id: string
    name: string
    email: string
    phone: string
    kycStatus: string
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingKyc: 0,
    underReviewKyc: 0,
    pendingTransactions: 0,
    completedTransactions: 0,
    totalDeposits: 0,
    totalInvestments: 0
  })
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [kycDocuments, setKycDocuments] = useState<KycDocument[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'transactions' | 'kyc' | 'notifications' | 'settings'>('overview')
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userKycDocuments, setUserKycDocuments] = useState<KycDocument[]>([])
  const [showUserActions, setShowUserActions] = useState<string | null>(null)
  const [previewDocument, setPreviewDocument] = useState<KycDocument | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [bulkValidating, setBulkValidating] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [documentToReject, setDocumentToReject] = useState<KycDocument | null>(null)
  const [rejectNotes, setRejectNotes] = useState('')
  const [showUserActionModal, setShowUserActionModal] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [userToAction, setUserToAction] = useState<User | null>(null)
  const [actionNotes, setActionNotes] = useState('')
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false)
  const [documentToChange, setDocumentToChange] = useState<KycDocument | null>(null)
  const [newStatus, setNewStatus] = useState<string | null>(null)
  const [statusChangeNotes, setStatusChangeNotes] = useState('')
  const [updatingDocuments, setUpdatingDocuments] = useState<Set<string>>(new Set())
  const [bulkOperationProgress, setBulkOperationProgress] = useState<{ current: number; total: number } | null>(null)

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    setAuthenticated(true)
    fetchDashboardData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserActions && !(event.target as Element).closest('.relative')) {
        setShowUserActions(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserActions])

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('admin_token')
      
      if (!token) {
        router.push('/admin/login')
        return
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
      
      // Fetch users
      const usersResponse = await fetch('/api/admin/users', { headers })
      const usersData = await usersResponse.json()
      
      if (usersData.success) {
        setUsers(usersData.users)
        
        // Calculate stats
        const totalUsers = usersData.users.length
        const pendingKyc = usersData.users.filter((u: User) => u.kycStatus === 'PENDING').length
        const underReviewKyc = usersData.users.filter((u: User) => u.kycStatus === 'UNDER_REVIEW').length
        const completedKyc = usersData.users.filter((u: User) => u.kycStatus === 'APPROVED').length
        
        setStats(prev => ({
          ...prev,
          totalUsers,
          pendingKyc,
          underReviewKyc,
        }))
      }

      // Fetch transactions
      const transactionsResponse = await fetch('/api/admin/transactions', { headers })
      const transactionsData = await transactionsResponse.json()
      
      if (transactionsData.success) {
        setTransactions(transactionsData.transactionIntents)
        
        const pendingTransactions = transactionsData.transactionIntents.filter((t: Transaction) => t.status === 'PENDING').length
        const completedTransactions = transactionsData.transactionIntents.filter((t: Transaction) => t.status === 'COMPLETED').length
        const totalDeposits = transactionsData.transactionIntents
          .filter((t: Transaction) => t.intentType === 'DEPOSIT' && t.status === 'COMPLETED')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
        const totalInvestments = transactionsData.transactionIntents
          .filter((t: Transaction) => t.intentType === 'INVESTMENT' && t.status === 'COMPLETED')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
        
        setStats(prev => ({
          ...prev,
          pendingTransactions,
          completedTransactions,
          totalDeposits,
          totalInvestments
        }))
      }

      // Fetch KYC documents
      const kycResponse = await fetch('/api/admin/kyc', { headers })
      const kycData = await kycResponse.json()
      
      if (kycData.success) {
        setKycDocuments(kycData.kycDocuments)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [router])

  const updateTransactionStatus = async (transactionId: string, status: string, adminNotes?: string) => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch(`/api/admin/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, adminNotes }),
      })

      if (response.ok) {
        await fetchDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Error updating transaction status:', error)
    }
  }

  const updateKycStatus = async (userId: string, status: string) => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch(`/api/admin/users/${userId}/kyc`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kycStatus: status }),
      })

      if (response.ok) {
        await fetchDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Error updating KYC status:', error)
    }
  }

  const updateKycDocumentStatus = async (documentId: string, status: string, adminNotes?: string) => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      // Add to updating documents set
      setUpdatingDocuments(prev => new Set(prev).add(documentId))

      // Optimistic update - update UI immediately
      setUserKycDocuments(prev =>
        prev.map(doc =>
          doc.id === documentId
            ? { ...doc, verificationStatus: status, adminNotes }
            : doc
        )
      )

      const response = await fetch(`/api/admin/kyc/${documentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationStatus: status, adminNotes }),
      })

      if (response.ok) {
        const result = await response.json()
        // Update with server response to ensure consistency
        setUserKycDocuments(prev =>
          prev.map(doc =>
            doc.id === documentId
              ? {
                  ...doc,
                  verificationStatus: result.document.verificationStatus,
                  adminNotes: result.document.adminNotes
                }
              : doc
          )
        )

        // Update user stats in the users list if KYC status changed
        if (selectedUser && result.document.user.kycStatus !== selectedUser.kycStatus) {
          setUsers(prev =>
            prev.map(user =>
              user.id === selectedUser.id
                ? { ...user, kycStatus: result.document.user.kycStatus }
                : user
            )
          )
          setSelectedUser(prev => prev ? { ...prev, kycStatus: result.document.user.kycStatus } : null)
        }
      } else {
        // Revert optimistic update on error
        await fetchUserKycDocuments(selectedUser!.id)
        alert('Failed to update document status. Please try again.')
      }
    } catch (error) {
      console.error('Error updating KYC document status:', error)
      // Revert optimistic update on error
      if (selectedUser) {
        await fetchUserKycDocuments(selectedUser.id)
      }
      alert('Error updating document status. Please try again.')
    } finally {
      // Remove from updating documents set
      setUpdatingDocuments(prev => {
        const newSet = new Set(prev)
        newSet.delete(documentId)
        return newSet
      })
    }
  }

  const checkAndUpdateUserKycStatus = async (userId: string) => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) return

      // Fetch updated user documents
      const response = await fetch(`/api/kyc/upload?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success && data.documents) {
        const documents = data.documents
        const pendingDocs = documents.filter((doc: any) => doc.verificationStatus === 'PENDING')
        const approvedDocs = documents.filter((doc: any) => doc.verificationStatus === 'APPROVED')
        const rejectedDocs = documents.filter((doc: any) => doc.verificationStatus === 'REJECTED')

        // If any documents have been processed (approved or rejected), set status to UNDER_REVIEW
        if (approvedDocs.length > 0 || rejectedDocs.length > 0) {
          // Only approve user KYC if ALL documents are approved
          if (approvedDocs.length > 0 && pendingDocs.length === 0 && rejectedDocs.length === 0) {
            await updateKycStatus(userId, 'APPROVED')
          }
          // If any documents are rejected, mark user KYC as rejected
          else if (rejectedDocs.length > 0) {
            await updateKycStatus(userId, 'REJECTED')
          }
          // If there are still pending documents but some are processed, set to UNDER_REVIEW
          else if (pendingDocs.length > 0) {
            await updateKycStatus(userId, 'UNDER_REVIEW')
          }
        }
        // If no documents have been processed yet, keep as PENDING
        else if (pendingDocs.length > 0) {
          await updateKycStatus(userId, 'PENDING')
        }
      }
    } catch (error) {
      console.error('Error checking user KYC status:', error)
    }
  }

  const fetchUserKycDocuments = async (userId: string) => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch(`/api/kyc/upload?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        setUserKycDocuments(data.documents)
      }
    } catch (error) {
      console.error('Error fetching user KYC documents:', error)
    }
  }

  const handleReviewKyc = async (user: User) => {
    setSelectedUser(user)
    setActiveTab('kyc')
    await fetchUserKycDocuments(user.id)
  }

  const handleBulkValidate = async (userId: string, status: string) => {
    try {
      setBulkValidating(true)
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const pendingDocs = userKycDocuments.filter(doc => doc.verificationStatus === 'PENDING')

      if (pendingDocs.length === 0) {
        alert('No pending documents to validate.')
        setBulkValidating(false)
        return
      }

      // Optimistic update - update UI immediately
      setUserKycDocuments(prev =>
        prev.map(doc =>
          doc.verificationStatus === 'PENDING'
            ? { ...doc, verificationStatus: status, adminNotes }
            : doc
        )
      )

      // Use batch API for efficient processing
      const updates = pendingDocs.map(doc => ({
        documentId: doc.id,
        verificationStatus: status,
        adminNotes
      }))

      const response = await fetch('/api/admin/kyc/batch', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates, userId }),
      })

      if (response.ok) {
        const result = await response.json()
        // Update with server response to ensure consistency
        setUserKycDocuments(result.data.updatedDocuments)

        // Update user stats in the users list
        if (result.data.userKycStatusUpdated) {
          setUsers(prev =>
            prev.map(user =>
              user.id === userId
                ? { ...user, kycStatus: result.data.newUserKycStatus }
                : user
            )
          )
        }

        // Show success message
        alert(`Successfully ${status.toLowerCase()}ed ${pendingDocs.length} document(s).`)
      } else {
        // Revert optimistic update on error
        await fetchUserKycDocuments(userId)
        alert('Failed to bulk validate documents. Please try again.')
      }

      setAdminNotes('')
      setBulkValidating(false)
    } catch (error) {
      console.error('Error bulk validating documents:', error)
      // Revert optimistic update on error
      if (selectedUser) {
        await fetchUserKycDocuments(selectedUser.id)
      }
      alert('Error during bulk validation. Please try again.')
      setBulkValidating(false)
    }
  }

  const getDocumentIcon = (documentType: string) => {
    if (documentType.includes('selfie') || documentType.includes('photo')) {
      return <FileImage className="h-5 w-5 text-blue-500" />
    }
    return <FileText className="h-5 w-5 text-gray-500" />
  }

  const isImageFile = (fileName: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
  }

  const handleApproveDocument = (doc: KycDocument) => {
    updateKycDocumentStatus(doc.id, 'APPROVED')
  }

  const handleRejectDocument = (doc: KycDocument) => {
    setDocumentToReject(doc)
    setRejectNotes('')
    setShowNotesModal(true)
  }

  const handleResetDocument = (doc: KycDocument) => {
    setDocumentToChange(doc)
    setNewStatus('PENDING')
    setStatusChangeNotes('')
    setShowStatusChangeModal(true)
  }

  const confirmRejectDocument = async () => {
    if (!documentToReject) return

    await updateKycDocumentStatus(documentToReject.id, 'REJECTED', rejectNotes)
    setShowNotesModal(false)
    setDocumentToReject(null)
    setRejectNotes('')
  }

  const confirmStatusChange = async () => {
    if (!documentToChange || !newStatus) return

    await updateKycDocumentStatus(documentToChange.id, newStatus, statusChangeNotes)
    setShowStatusChangeModal(false)
    setDocumentToChange(null)
    setNewStatus(null)
    setStatusChangeNotes('')
  }

  const handleUserAction = (user: User, action: string) => {
    setUserToAction(user)
    setSelectedAction(action)
    setActionNotes('')
    setShowUserActionModal(true)
    setShowUserActions(null)
  }

  const confirmUserAction = async () => {
    if (!userToAction || !selectedAction) return

    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      let endpoint = ''
      let body: any = { action: selectedAction }

      switch (selectedAction) {
        case 'delete':
          endpoint = `/api/admin/users/${userToAction.id}`
          break
        case 'archive':
          endpoint = `/api/admin/users/${userToAction.id}/status`
          body = { status: 'ARCHIVED', notes: actionNotes }
          break
        case 'suspend':
          endpoint = `/api/admin/users/${userToAction.id}/status`
          body = { status: 'SUSPENDED', notes: actionNotes }
          break
        case 'activate':
          endpoint = `/api/admin/users/${userToAction.id}/status`
          body = { status: 'ACTIVE', notes: actionNotes }
          break
        default:
          return
      }

      const response = await fetch(endpoint, {
        method: selectedAction === 'delete' ? 'DELETE' : 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: selectedAction === 'delete' ? undefined : JSON.stringify(body),
      })

      if (response.ok) {
        await fetchDashboardData() // Refresh data
        setShowUserActionModal(false)
        setUserToAction(null)
        setSelectedAction(null)
        setActionNotes('')
      }
    } catch (error) {
      console.error('Error performing user action:', error)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'delete': return <Trash2 className="h-4 w-4" />
      case 'archive': return <Archive className="h-4 w-4" />
      case 'suspend': return <Ban className="h-4 w-4" />
      case 'activate': return <UserCheck className="h-4 w-4" />
      case 'edit': return <Edit className="h-4 w-4" />
      default: return <MoreVertical className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'delete': return 'text-red-700 hover:bg-red-50'
      case 'archive': return 'text-orange-700 hover:bg-orange-50'
      case 'suspend': return 'text-yellow-700 hover:bg-yellow-50'
      case 'activate': return 'text-green-700 hover:bg-green-50'
      case 'edit': return 'text-gray-700 hover:bg-gray-50'
      default: return 'text-gray-700 hover:bg-gray-50'
    }
  }

  const handleRecalculateBalances = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch('/api/admin/accounts/recalculate-balances', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (result.success) {
        alert(`Balances recalculated successfully!\n\nUpdated ${result.updatedAccounts} out of ${result.totalAccounts} accounts.\n\nCheck the console for detailed results.`)
        console.log('Balance recalculation results:', result.results)
        await fetchDashboardData() // Refresh dashboard data
      } else {
        alert('Error recalculating balances: ' + result.error)
      }
    } catch (error) {
      console.error('Error recalculating balances:', error)
      alert('Error recalculating balances')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (token) {
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear all admin data
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_refresh_token')
      localStorage.removeItem('admin_user')
      router.push('/admin/login')
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Sama Naffa Platform Management</p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={fetchDashboardData} className="bg-blue-600 hover:bg-blue-700">
                Refresh Data
              </Button>
              <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'transactions', label: 'Transactions', icon: CreditCard },
              { id: 'kyc', label: 'KYC Review', icon: FileText },
              { id: 'notifications', label: 'Notifications', icon: MessageSquare },
              { id: 'settings', label: 'Settings', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pendingKyc}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.underReviewKyc}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
                  <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.pendingTransactions}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Transactions</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.completedTransactions}</div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Total Deposits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {stats.totalDeposits.toLocaleString()} FCFA
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Total Investments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.totalInvestments.toLocaleString()} FCFA
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Admin Tools</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button
                    onClick={handleRecalculateBalances}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Recalculating...' : 'Recalculate All Balances'}
                  </Button>
                  <p className="text-sm text-gray-600 flex items-center">
                    Use this tool to ensure all account balances match their completed transactions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto min-h-[50vh]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.kycStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            user.kycStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            user.kycStatus === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.kycStatus === 'UNDER_REVIEW' ? 'UNDER REVIEW' : user.kycStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.stats.totalTransactions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="relative">
                            <button
                              onClick={() => setShowUserActions(showUserActions === user.id ? null : user.id)}
                              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                            >
                              <span>Actions</span>
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            
                            {showUserActions === user.id && (
                              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
                                <div className="py-1">
                                  {/* KYC Actions */}
                                  <button
                                    onClick={() => {
                                      handleReviewKyc(user)
                                      setShowUserActions(null)
                                    }}
                                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span>Review KYC</span>
                                  </button>
                                  
                                  {/* Divider */}
                                  <div className="border-t border-gray-100 my-1"></div>
                                  
                                  {/* User Management Actions */}
                                  <button
                                    onClick={() => handleUserAction(user, 'edit')}
                                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span>Edit User</span>
                                  </button>
                                  
                                  <button
                                    onClick={() => handleUserAction(user, 'activate')}
                                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                                  >
                                    <UserCheck className="h-4 w-4" />
                                    <span>Activate Account</span>
                                  </button>
                                  
                                  <button
                                    onClick={() => handleUserAction(user, 'suspend')}
                                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50"
                                  >
                                    <Ban className="h-4 w-4" />
                                    <span>Suspend Account</span>
                                  </button>
                                  
                                  <button
                                    onClick={() => handleUserAction(user, 'archive')}
                                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-orange-700 hover:bg-orange-50"
                                  >
                                    <Archive className="h-4 w-4" />
                                    <span>Archive Account</span>
                                  </button>
                                  
                                  {/* Divider */}
                                  <div className="border-t border-gray-100 my-1"></div>
                                  
                                  {/* Destructive Actions */}
                                  <button
                                    onClick={() => handleUserAction(user, 'delete')}
                                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete User</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <Card>
            <CardHeader>
              <CardTitle>Transaction Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {transaction.referenceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{transaction.user.name}</div>
                            <div className="text-sm text-gray-500">{transaction.user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.intentType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.amount.toLocaleString()} FCFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            transaction.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {transaction.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateTransactionStatus(transaction.id, 'PROCESSING')}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Process
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => updateTransactionStatus(transaction.id, 'COMPLETED')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Complete
                              </Button>
                            </>
                          )}
                          {transaction.status === 'PROCESSING' && (
                            <Button
                              size="sm"
                              onClick={() => updateTransactionStatus(transaction.id, 'COMPLETED')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Complete
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* KYC Tab */}
        {activeTab === 'kyc' && (
          <div className="space-y-6">
            {/* Header with user selection */}
            {selectedUser && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Eye className="h-5 w-5" />
                        <span>KYC Review - {selectedUser.firstName} {selectedUser.lastName}</span>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedUser.email} • {selectedUser.phone}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setSelectedUser(null)}
                        className="bg-gray-600 hover:bg-gray-700"
                      >
                        View All Users
                      </Button>
                      {userKycDocuments.some(doc => doc.verificationStatus === 'PENDING') && (
                        <Button
                          onClick={() => handleBulkValidate(selectedUser.id, 'APPROVED')}
                          disabled={bulkValidating}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {bulkValidating ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>
                                {bulkOperationProgress
                                  ? `Validating... (${bulkOperationProgress.current}/${bulkOperationProgress.total})`
                                  : 'Validating...'
                                }
                              </span>
                            </div>
                          ) : (
                            'Validate All'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}

            {/* User selection or document list */}
            {!selectedUser ? (
              <Card>
                <CardHeader>
                  <CardTitle>KYC Document Review</CardTitle>
                  <p className="text-sm text-gray-600">Select a user to review their KYC documents</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.filter(user => user.stats.totalKycDocuments > 0).map((user) => (
                      <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{user.firstName} {user.lastName}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {user.stats.totalKycDocuments} document(s) • {user.kycStatus === 'UNDER_REVIEW' ? 'UNDER REVIEW' : user.kycStatus}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleReviewKyc(user)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Documents for {selectedUser.firstName} {selectedUser.lastName}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Total: {userKycDocuments.length}</span>
                    <span>Pending: {userKycDocuments.filter(doc => doc.verificationStatus === 'PENDING').length}</span>
                    <span>Approved: {userKycDocuments.filter(doc => doc.verificationStatus === 'APPROVED').length}</span>
                    <span>Rejected: {userKycDocuments.filter(doc => doc.verificationStatus === 'REJECTED').length}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userKycDocuments.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getDocumentIcon(doc.documentType)}
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {doc.documentType.replace('_', ' ').toUpperCase()}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {new Date(doc.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            doc.verificationStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            doc.verificationStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {doc.verificationStatus}
                          </span>
                        </div>

                        {/* Document Preview */}
                        <div className="mb-4">
                          {isImageFile(doc.fileName) ? (
                            <div className="relative">
                              <Image
                                src={doc.fileUrl}
                                alt={doc.fileName}
                                width={100}
                                height={100}
                                className="w-full h-auto object-cover rounded border cursor-pointer hover:opacity-90"
                                onClick={() => setPreviewDocument(doc)}
                              />
                            </div>
                          ) : (
                            <div 
                              className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center cursor-pointer hover:bg-gray-200"
                              onClick={() => setPreviewDocument(doc)}
                            >
                              <div className="text-center">
                                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-600">{doc.fileName}</p>
                                <p className="text-xs text-blue-600 mt-1">Click to preview</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          {updatingDocuments.has(doc.id) ? (
                            <div className="flex items-center justify-center flex-1 text-blue-600 text-sm">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                              Updating...
                            </div>
                          ) : (
                            <>
                              {doc.verificationStatus === 'PENDING' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveDocument(doc)}
                                    className="bg-green-600 hover:bg-green-700 flex-1"
                                    disabled={updatingDocuments.has(doc.id)}
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleRejectDocument(doc)}
                                    className="bg-red-600 hover:bg-red-700 flex-1"
                                    disabled={updatingDocuments.has(doc.id)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              {doc.verificationStatus === 'APPROVED' && (
                                <>
                                  <div className="flex items-center justify-center flex-1 text-green-600 text-sm">
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Approved
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => handleResetDocument(doc)}
                                    className="bg-gray-600 hover:bg-gray-700 flex-1"
                                    disabled={updatingDocuments.has(doc.id)}
                                  >
                                    <RotateCcw className="h-4 w-4 mr-1" />
                                    Reset
                                  </Button>
                                </>
                              )}
                              {doc.verificationStatus === 'REJECTED' && (
                                <>
                                  <div className="flex items-center justify-center flex-1 text-red-600 text-sm">
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Rejected
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => handleResetDocument(doc)}
                                    className="bg-gray-600 hover:bg-gray-700 flex-1"
                                    disabled={updatingDocuments.has(doc.id)}
                                  >
                                    <RotateCcw className="h-4 w-4 mr-1" />
                                    Reset
                                  </Button>
                                </>
                              )}
                            </>
                          )}
                        </div>

                        {/* Admin Notes */}
                        {doc.adminNotes && (
                          <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                            <p className="font-medium text-gray-700">Admin Notes:</p>
                            <p className="text-gray-600">{doc.adminNotes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {userKycDocuments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No KYC documents found for this user</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Document Preview Modal */}
        {previewDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium">{previewDocument.fileName}</h3>
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4">
                {isImageFile(previewDocument.fileName) ? (
                  <Image
                    src={previewDocument.fileUrl}
                    alt={previewDocument.fileName}
                    width={800}
                    height={600}
                    className="max-w-full h-auto rounded"
                  />
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">PDF Document Preview</p>
                    <a
                      href={previewDocument.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download to view</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Admin Notes Modal */}
        {showNotesModal && documentToReject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium">Reject Document</h3>
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Document: <span className="font-medium">{documentToReject.fileName}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Type: <span className="font-medium">{documentToReject.documentType.replace('_', ' ').toUpperCase()}</span>
                  </p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="rejectNotes" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for rejection (required)
                  </label>
                  <textarea
                    id="rejectNotes"
                    value={rejectNotes}
                    onChange={(e) => setRejectNotes(e.target.value)}
                    placeholder="Please provide a reason for rejecting this document..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowNotesModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmRejectDocument}
                    disabled={!rejectNotes.trim()}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject Document
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Action Confirmation Modal */}
        {showUserActionModal && userToAction && selectedAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium flex items-center space-x-2">
                  {getActionIcon(selectedAction)}
                  <span>
                    {selectedAction === 'delete' && 'Delete User'}
                    {selectedAction === 'archive' && 'Archive User'}
                    {selectedAction === 'suspend' && 'Suspend User'}
                    {selectedAction === 'activate' && 'Activate User'}
                    {selectedAction === 'edit' && 'Edit User'}
                  </span>
                </h3>
                <button
                  onClick={() => setShowUserActionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    User: <span className="font-medium">{userToAction.firstName} {userToAction.lastName}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: <span className="font-medium">{userToAction.email}</span>
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-3">
                    {selectedAction === 'delete' && 'Are you sure you want to permanently delete this user? This action cannot be undone.'}
                    {selectedAction === 'archive' && 'Archive this user account? This will permanently deactivate the account and move it to archived status. The user will not be able to access their account.'}
                    {selectedAction === 'suspend' && 'Suspend this user account? This will temporarily disable access. The user will not be able to log in until reactivated.'}
                    {selectedAction === 'activate' && 'Activate this user account? The user will regain full access to their account.'}
                    {selectedAction === 'edit' && 'Edit this user\'s information? You will be redirected to the edit page.'}
                  </p>
                  
                  {(selectedAction !== 'delete' && selectedAction !== 'edit') && (
                    <div>
                      <label htmlFor="actionNotes" className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (optional)
                      </label>
                      <textarea
                        id="actionNotes"
                        value={actionNotes}
                        onChange={(e) => setActionNotes(e.target.value)}
                        placeholder="Add any notes about this action..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowUserActionModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmUserAction}
                    className={`flex-1 ${
                      selectedAction === 'delete' ? 'bg-red-600 hover:bg-red-700' :
                      selectedAction === 'suspend' ? 'bg-red-600 hover:bg-red-700' :
                      selectedAction === 'archive' ? 'bg-orange-600 hover:bg-orange-700' :
                      'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {getActionIcon(selectedAction)}
                    <span className="ml-1">
                      {selectedAction === 'delete' && 'Delete User'}
                      {selectedAction === 'archive' && 'Archive User'}
                      {selectedAction === 'suspend' && 'Suspend User'}
                      {selectedAction === 'activate' && 'Activate User'}
                      {selectedAction === 'edit' && 'Edit User'}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Status Change Confirmation Modal */}
        {showStatusChangeModal && documentToChange && newStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium flex items-center space-x-2">
                  {newStatus === 'PENDING' ? <RotateCcw className="h-5 w-5 text-gray-600" /> : 
                   newStatus === 'APPROVED' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : 
                   <XCircle className="h-5 w-5 text-red-600" />}
                  <span>
                    {newStatus === 'PENDING' ? 'Reset Document Status' : 'Change Document Status'}
                  </span>
                </h3>
                <button
                  onClick={() => setShowStatusChangeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Document: <span className="font-medium">{documentToChange.fileName}</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Type: <span className="font-medium">{documentToChange.documentType.replace('_', ' ').toUpperCase()}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Current Status: <span className={`font-medium ${
                      documentToChange.verificationStatus === 'APPROVED' ? 'text-green-600' : 
                      documentToChange.verificationStatus === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {documentToChange.verificationStatus}
                    </span>
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-3">
                    {newStatus === 'PENDING' 
                      ? 'Are you sure you want to reset this document status to PENDING? This will allow the document to be reviewed again and may affect the user\'s KYC status.'
                      : newStatus === 'APPROVED' 
                      ? 'Are you sure you want to change this document status to APPROVED? This will update the user\'s KYC status accordingly.'
                      : 'Are you sure you want to change this document status to REJECTED? This will update the user\'s KYC status accordingly.'
                    }
                  </p>
                  
                  <div>
                    <label htmlFor="statusChangeNotes" className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for status change (optional)
                    </label>
                    <textarea
                      id="statusChangeNotes"
                      value={statusChangeNotes}
                      onChange={(e) => setStatusChangeNotes(e.target.value)}
                      placeholder={newStatus === 'PENDING' ? 'Add any notes about resetting this document...' : 'Add any notes about this status change...'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowStatusChangeModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmStatusChange}
                    className={`flex-1 ${
                      newStatus === 'PENDING' ? 'bg-gray-600 hover:bg-gray-700' :
                      newStatus === 'APPROVED' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {newStatus === 'PENDING' ? <RotateCcw className="h-4 w-4 mr-1" /> :
                     newStatus === 'APPROVED' ? <CheckCircle2 className="h-4 w-4 mr-1" /> : 
                     <XCircle className="h-4 w-4 mr-1" />}
                    <span className="ml-1">
                      {newStatus === 'PENDING' ? 'Reset to Pending' : `Change to ${newStatus}`}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Send KYC Status Notification</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NotificationManagement />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <NotificationSettings />
          </div>
        )}
      </div>
    </div>
  )
}
