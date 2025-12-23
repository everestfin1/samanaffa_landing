'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/common/Button'
import NotificationManagement from '@/components/admin/NotificationManagement'
import NotificationSettings from '@/components/admin/NotificationSettings'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import IntouchReconciliation from '@/components/admin/IntouchReconciliation'
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
  RotateCcw,
  FileSpreadsheet,
  Filter,
  RefreshCw,
  LogOut,
  LayoutDashboard,
  Wallet,
  Settings,
  X,
  Gift,
  GraduationCap,
  Phone,
  Mail
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

interface ApeSubscription {
  id: string
  referenceNumber: string
  civilite: string
  prenom: string
  nom: string
  email: string
  telephone: string
  paysResidence: string
  ville: string
  categorieSocioprofessionnelle: string
  trancheInteresse: string
  montantCfa: string
  codeParrainage?: string
  status: string
  providerTransactionId?: string
  providerStatus?: string
  paymentInitiatedAt?: string
  paymentCompletedAt?: string
  createdAt: string
  updatedAt: string
}

interface ApeStats {
  total: number
  pending: number
  paymentInitiated: number
  paymentSuccess: number
  paymentFailed: number
  cancelled: number
  totalAmount: number
}

interface SponsorCode {
  id: string
  code: string
  description?: string
  status: string
  usageCount: number
  maxUsage?: number
  expiresAt?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  createdByAdmin?: {
    id: string
    name: string
    email: string
  }
}

interface SponsorCodeStats {
  total: number
  active: number
  inactive: number
  expired: number
}

interface PeeLead {
  id: string
  civilite: string
  prenom: string
  nom: string
  categorie: string
  pays: string
  ville: string
  telephone: string
  email?: string
  status: string
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

interface PeeLeadStats {
  total: number
  new: number
  contacted: number
  converted: number
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
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'transactions' | 'kyc' | 'apeSubscriptions' | 'reconciliation' | 'sponsorCodes' | 'peeLeads' | 'notifications' | 'settings'>('overview')
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
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
  const [apeSubscriptions, setApeSubscriptions] = useState<ApeSubscription[]>([])
  const [apeStats, setApeStats] = useState<ApeStats>({
    total: 0,
    pending: 0,
    paymentInitiated: 0,
    paymentSuccess: 0,
    paymentFailed: 0,
    cancelled: 0,
    totalAmount: 0
  })
  const [apeStatusFilter, setApeStatusFilter] = useState<string>('')
  const [exportingApe, setExportingApe] = useState(false)
  
  // Transaction filters
  const [transactionStatusFilter, setTransactionStatusFilter] = useState<string>('')
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>('')
  
  // APE Status Update Modal
  const [showApeStatusModal, setShowApeStatusModal] = useState(false)
  const [selectedApeSubscription, setSelectedApeSubscription] = useState<ApeSubscription | null>(null)
  const [newApeStatus, setNewApeStatus] = useState<string>('')
  const [apeProviderTransactionId, setApeProviderTransactionId] = useState('')
  const [apeStatusNotes, setApeStatusNotes] = useState('')
  const [updatingApeStatus, setUpdatingApeStatus] = useState(false)

  // Sponsor Codes State
  const [sponsorCodes, setSponsorCodes] = useState<SponsorCode[]>([])
  const [sponsorCodeStats, setSponsorCodeStats] = useState<SponsorCodeStats>({
    total: 0,
    active: 0,
    inactive: 0,
    expired: 0
  })
  const [sponsorCodeStatusFilter, setSponsorCodeStatusFilter] = useState<string>('')
  const [showCreateCodeModal, setShowCreateCodeModal] = useState(false)
  const [showEditCodeModal, setShowEditCodeModal] = useState(false)
  const [selectedSponsorCode, setSelectedSponsorCode] = useState<SponsorCode | null>(null)
  const [newCodeData, setNewCodeData] = useState({
    code: '',
    description: '',
    maxUsage: '',
    expiresAt: ''
  })
  const [savingSponsorCode, setSavingSponsorCode] = useState(false)

  // PEE Leads State
  const [peeLeads, setPeeLeads] = useState<PeeLead[]>([])
  const [peeLeadStats, setPeeLeadStats] = useState<PeeLeadStats>({
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0
  })
  const [selectedPeeLead, setSelectedPeeLead] = useState<PeeLead | null>(null)
  const [showPeeLeadModal, setShowPeeLeadModal] = useState(false)
  const [peeLeadNotes, setPeeLeadNotes] = useState('')
  const [updatingPeeLead, setUpdatingPeeLead] = useState(false)

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
          .reduce((sum: number, t: Transaction) => sum + (Number(t.amount) || 0), 0)
        const totalInvestments = transactionsData.transactionIntents
          .filter((t: Transaction) => t.intentType === 'INVESTMENT' && t.status === 'COMPLETED')
          .reduce((sum: number, t: Transaction) => sum + (Number(t.amount) || 0), 0)
        
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

      // Fetch APE subscriptions
      const apeResponse = await fetch('/api/admin/ape-subscriptions', { headers })
      const apeData = await apeResponse.json()
      
      if (apeData.success) {
        setApeSubscriptions(apeData.subscriptions)
        setApeStats(apeData.stats)
      }

      // Fetch Sponsor Codes
      const sponsorCodesResponse = await fetch('/api/admin/sponsor-codes', { headers })
      const sponsorCodesData = await sponsorCodesResponse.json()
      
      if (sponsorCodesData.success) {
        setSponsorCodes(sponsorCodesData.codes)
        setSponsorCodeStats(sponsorCodesData.stats)
      }

      // Fetch PEE Leads
      const peeLeadsResponse = await fetch('/api/admin/pee-leads', { headers })
      const peeLeadsData = await peeLeadsResponse.json()
      
      if (peeLeadsData.success) {
        setPeeLeads(peeLeadsData.leads)
        setPeeLeadStats(peeLeadsData.stats)
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

  // APE Status Update Handlers
  const openApeStatusModal = (subscription: ApeSubscription) => {
    setSelectedApeSubscription(subscription)
    setNewApeStatus(subscription.status)
    setApeProviderTransactionId(subscription.providerTransactionId || '')
    setApeStatusNotes('')
    setShowApeStatusModal(true)
  }

  const handleUpdateApeStatus = async () => {
    if (!selectedApeSubscription || !newApeStatus) {
      alert('Veuillez sélectionner un statut')
      return
    }

    if (newApeStatus === selectedApeSubscription.status) {
      alert('Le statut est déjà ' + newApeStatus)
      return
    }

    setUpdatingApeStatus(true)
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        alert('Session expirée. Veuillez vous reconnecter.')
        router.push('/admin/login')
        return
      }

      console.log('[Admin] Updating APE subscription:', {
        id: selectedApeSubscription.id,
        oldStatus: selectedApeSubscription.status,
        newStatus: newApeStatus,
        providerTransactionId: apeProviderTransactionId,
      })

      const response = await fetch(`/api/admin/ape-subscriptions/${selectedApeSubscription.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newApeStatus,
          providerTransactionId: apeProviderTransactionId || undefined,
          adminNotes: apeStatusNotes || undefined,
        }),
      })

      const data = await response.json()
      
      console.log('[Admin] Update response:', data)
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }
      
      if (data.success) {
        // Update local state with server response
        setApeSubscriptions(prev => 
          prev.map(sub => 
            sub.id === selectedApeSubscription.id 
              ? { 
                  ...sub, 
                  ...data.subscription,
                }
              : sub
          )
        )
        
        // Update stats
        setApeStats(prev => {
          const oldStatus = selectedApeSubscription.status
          const newStats = { ...prev }
          
          // Decrement old status count
          if (oldStatus === 'PENDING') newStats.pending--
          else if (oldStatus === 'PAYMENT_INITIATED') newStats.paymentInitiated--
          else if (oldStatus === 'PAYMENT_SUCCESS') {
            newStats.paymentSuccess--
            newStats.totalAmount -= parseFloat(selectedApeSubscription.montantCfa)
          }
          else if (oldStatus === 'PAYMENT_FAILED') newStats.paymentFailed--
          else if (oldStatus === 'CANCELLED') newStats.cancelled--
          
          // Increment new status count
          if (newApeStatus === 'PENDING') newStats.pending++
          else if (newApeStatus === 'PAYMENT_INITIATED') newStats.paymentInitiated++
          else if (newApeStatus === 'PAYMENT_SUCCESS') {
            newStats.paymentSuccess++
            newStats.totalAmount += parseFloat(selectedApeSubscription.montantCfa)
          }
          else if (newApeStatus === 'PAYMENT_FAILED') newStats.paymentFailed++
          else if (newApeStatus === 'CANCELLED') newStats.cancelled++
          
          return newStats
        })
        
        alert(`✅ Statut mis à jour: ${selectedApeSubscription.status} → ${newApeStatus}`)
        setShowApeStatusModal(false)
        setSelectedApeSubscription(null)
        setApeProviderTransactionId('')
        setApeStatusNotes('')
      } else {
        throw new Error(data.error || 'Réponse invalide du serveur')
      }
    } catch (error) {
      console.error('[Admin] Error updating APE status:', error)
      alert(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setUpdatingApeStatus(false)
    }
  }

  // Sponsor Code CRUD Functions
  const handleCreateSponsorCode = async () => {
    if (!newCodeData.code.trim()) {
      alert('Le code est requis')
      return
    }

    setSavingSponsorCode(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/sponsor-codes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: newCodeData.code,
          description: newCodeData.description,
          maxUsage: newCodeData.maxUsage || null,
          expiresAt: newCodeData.expiresAt || null,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSponsorCodes(prev => [data.sponsorCode, ...prev])
        setSponsorCodeStats(prev => ({
          ...prev,
          total: prev.total + 1,
          active: prev.active + 1
        }))
        setShowCreateCodeModal(false)
        setNewCodeData({ code: '', description: '', maxUsage: '', expiresAt: '' })
      } else {
        alert(data.error || 'Erreur lors de la création')
      }
    } catch (error) {
      console.error('Error creating sponsor code:', error)
      alert('Erreur lors de la création du code')
    } finally {
      setSavingSponsorCode(false)
    }
  }

  const handleUpdateSponsorCode = async () => {
    if (!selectedSponsorCode) return

    setSavingSponsorCode(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/sponsor-codes', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedSponsorCode.id,
          description: newCodeData.description,
          maxUsage: newCodeData.maxUsage || null,
          expiresAt: newCodeData.expiresAt || null,
          status: selectedSponsorCode.status,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSponsorCodes(prev =>
          prev.map(code =>
            code.id === selectedSponsorCode.id
              ? { ...code, ...data.sponsorCode }
              : code
          )
        )
        setShowEditCodeModal(false)
        setSelectedSponsorCode(null)
        setNewCodeData({ code: '', description: '', maxUsage: '', expiresAt: '' })
      } else {
        alert(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error updating sponsor code:', error)
      alert('Erreur lors de la mise à jour du code')
    } finally {
      setSavingSponsorCode(false)
    }
  }

  const handleToggleSponsorCodeStatus = async (code: SponsorCode) => {
    const newStatus = code.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/sponsor-codes', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: code.id,
          status: newStatus,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSponsorCodes(prev =>
          prev.map(c =>
            c.id === code.id ? { ...c, status: newStatus } : c
          )
        )
        setSponsorCodeStats(prev => ({
          ...prev,
          active: newStatus === 'ACTIVE' ? prev.active + 1 : prev.active - 1,
          inactive: newStatus === 'INACTIVE' ? prev.inactive + 1 : prev.inactive - 1,
        }))
      } else {
        alert(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error toggling sponsor code status:', error)
      alert('Erreur lors du changement de statut')
    }
  }

  const handleDeleteSponsorCode = async (code: SponsorCode) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le code "${code.code}" ?`)) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/sponsor-codes?id=${code.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        setSponsorCodes(prev => prev.filter(c => c.id !== code.id))
        setSponsorCodeStats(prev => ({
          ...prev,
          total: prev.total - 1,
          active: code.status === 'ACTIVE' ? prev.active - 1 : prev.active,
          inactive: code.status === 'INACTIVE' ? prev.inactive - 1 : prev.inactive,
          expired: code.status === 'EXPIRED' ? prev.expired - 1 : prev.expired,
        }))
      } else {
        alert(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting sponsor code:', error)
      alert('Erreur lors de la suppression du code')
    }
  }

  const openEditCodeModal = (code: SponsorCode) => {
    setSelectedSponsorCode(code)
    setNewCodeData({
      code: code.code,
      description: code.description || '',
      maxUsage: code.maxUsage?.toString() || '',
      expiresAt: code.expiresAt ? new Date(code.expiresAt).toISOString().split('T')[0] : '',
    })
    setShowEditCodeModal(true)
  }

  // PEE Lead Update Function
  const handleUpdatePeeLead = async (status: string) => {
    if (!selectedPeeLead) return

    setUpdatingPeeLead(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/pee-leads', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedPeeLead.id,
          status,
          adminNotes: peeLeadNotes,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setPeeLeads(prev =>
          prev.map(lead =>
            lead.id === selectedPeeLead.id
              ? { ...lead, status, adminNotes: peeLeadNotes }
              : lead
          )
        )
        // Update stats
        const newStats = { ...peeLeadStats }
        if (selectedPeeLead.status === 'NEW') newStats.new--
        if (selectedPeeLead.status === 'CONTACTED') newStats.contacted--
        if (selectedPeeLead.status === 'CONVERTED') newStats.converted--
        if (status === 'NEW') newStats.new++
        if (status === 'CONTACTED') newStats.contacted++
        if (status === 'CONVERTED') newStats.converted++
        setPeeLeadStats(newStats)
        
        setShowPeeLeadModal(false)
        setSelectedPeeLead(null)
        setPeeLeadNotes('')
      } else {
        alert(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error updating PEE lead:', error)
      alert('Erreur lors de la mise à jour du lead')
    } finally {
      setUpdatingPeeLead(false)
    }
  }

  const SPONSOR_CODE_STATUS_CONFIG = {
    ACTIVE: { label: 'Actif', color: 'emerald' },
    INACTIVE: { label: 'Inactif', color: 'neutral' },
    EXPIRED: { label: 'Expiré', color: 'rose' },
  }

  const APE_STATUS_CONFIG = {
    PENDING: { label: 'En attente', color: 'amber', description: 'Souscription créée, paiement non initié' },
    PAYMENT_INITIATED: { label: 'Paiement initié', color: 'sky', description: 'Paiement en cours de traitement' },
    PAYMENT_SUCCESS: { label: 'Payé', color: 'emerald', description: 'Paiement confirmé avec succès' },
    PAYMENT_FAILED: { label: 'Échoué', color: 'rose', description: 'Le paiement a échoué' },
    CANCELLED: { label: 'Annulé', color: 'neutral', description: 'Souscription annulée' },
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="admin-spinner mx-auto"></div>
          <p className="mt-4 text-[var(--admin-text-muted)]">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="admin-spinner mx-auto"></div>
          <p className="mt-4 text-[var(--admin-text-muted)]">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  // Get tab title for header
  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Vue d\'ensemble'
      case 'kyc': return 'Vérification KYC'
      case 'apeSubscriptions': return 'APE Sénégal'
      case 'sponsorCodes': return 'Codes Parrainage'
      case 'peeLeads': return 'PEE Leads'
      case 'users': return 'Utilisateurs'
      case 'transactions': return 'Transactions'
      case 'notifications': return 'Notifications'
      case 'settings': return 'Paramètres'
      default: return 'Administration'
    }
  }

  return (
    <div className="admin-layout" data-sidebar-collapsed={sidebarCollapsed}>
      {/* Sidebar Navigation */}
      <AdminSidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        stats={{
          pendingKyc: stats.pendingKyc,
          pendingTransactions: stats.pendingTransactions,
          paymentInitiated: apeStats.paymentInitiated,
        }}
      />
      
      {/* Main Content */}
      <main className="admin-main">
        <AdminHeader 
          title={getTabTitle()}
          subtitle="Tableau de bord administrateur"
          onRefresh={fetchDashboardData}
          loading={loading}
        />
        
        <div className="admin-main-content">
          {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="admin-grid admin-grid-5">
              <div className="admin-stat-card admin-animate-in" data-color="gold">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Utilisateurs</span>
                  <div className="admin-stat-icon">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="admin-stat-value">{stats.totalUsers}</div>
              </div>

              <div className="admin-stat-card admin-animate-in" data-color="amber">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">KYC en attente</span>
                  <div className="admin-stat-icon">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="admin-stat-value colored">{stats.pendingKyc}</div>
              </div>

              <div className="admin-stat-card admin-animate-in" data-color="sky">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">En révision</span>
                  <div className="admin-stat-icon">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="admin-stat-value colored">{stats.underReviewKyc}</div>
              </div>

              <div className="admin-stat-card admin-animate-in" data-color="violet">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Trans. en attente</span>
                  <div className="admin-stat-icon">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="admin-stat-value colored">{stats.pendingTransactions}</div>
              </div>

              <div className="admin-stat-card admin-animate-in" data-color="emerald">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Trans. complétées</span>
                  <div className="admin-stat-icon">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="admin-stat-value colored">{stats.completedTransactions}</div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="admin-grid admin-grid-2">
              <div className="admin-card admin-animate-in" style={{ animationDelay: '300ms' }}>
                <div className="admin-card-header">
                  <h3 className="admin-card-title">
                    <Wallet className="admin-card-title-icon" />
                    Total Dépôts
                  </h3>
                </div>
                <div className="admin-card-content">
                  <div className="text-3xl font-bold text-[var(--admin-emerald)]">
                    {Math.round(stats.totalDeposits).toLocaleString('fr-SN')} <span className="text-lg font-medium text-[var(--admin-text-muted)]">FCFA</span>
                  </div>
                </div>
              </div>

              <div className="admin-card admin-animate-in" style={{ animationDelay: '350ms' }}>
                <div className="admin-card-header">
                  <h3 className="admin-card-title">
                    <TrendingUp className="admin-card-title-icon" />
                    Total Investissements
                  </h3>
                </div>
                <div className="admin-card-content">
                  <div className="text-3xl font-bold text-[var(--admin-sky)]">
                    {Math.round(stats.totalInvestments).toLocaleString('fr-SN')} <span className="text-lg font-medium text-[var(--admin-text-muted)]">FCFA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Tools */}
            <div className="admin-card admin-animate-in" style={{ animationDelay: '400ms' }}>
              <div className="admin-card-header">
                <h3 className="admin-card-title">
                  <Shield className="admin-card-title-icon" />
                  Outils d'administration
                </h3>
              </div>
              <div className="admin-card-content">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <button
                    onClick={handleRecalculateBalances}
                    disabled={loading}
                    className="admin-btn admin-btn-primary"
                  >
                    {loading ? 'Recalcul en cours...' : 'Recalculer tous les soldes'}
                  </button>
                  <p className="text-sm text-[var(--admin-text-muted)]">
                    Utilisez cet outil pour synchroniser les soldes avec les transactions complétées
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="admin-card admin-animate-in">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <Users className="admin-card-title-icon" />
                Gestion des utilisateurs
              </h3>
            </div>
            <div className="admin-card-content p-0">
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Utilisateur</th>
                      <th>Statut KYC</th>
                      <th>Transactions</th>
                      <th>Inscription</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div>
                            <div className="admin-table-cell-primary">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-[var(--admin-text-muted)]">{user.email}</div>
                          </div>
                        </td>
                        <td>
                          <span className={`admin-badge ${
                            user.kycStatus === 'APPROVED' ? 'admin-badge-success' :
                            user.kycStatus === 'PENDING' ? 'admin-badge-warning' :
                            user.kycStatus === 'UNDER_REVIEW' ? 'admin-badge-info' :
                            'admin-badge-danger'
                          }`}>
                            <span className="admin-badge-dot"></span>
                            {user.kycStatus === 'UNDER_REVIEW' ? 'En révision' : 
                             user.kycStatus === 'APPROVED' ? 'Approuvé' :
                             user.kycStatus === 'PENDING' ? 'En attente' : 'Rejeté'}
                          </span>
                        </td>
                        <td className="admin-table-cell-primary">
                          {user.stats.totalTransactions}
                        </td>
                        <td className="admin-table-cell-mono">
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td>
                          <div className="admin-dropdown">
                            <button
                              onClick={() => setShowUserActions(showUserActions === user.id ? null : user.id)}
                              className="admin-btn admin-btn-ghost admin-btn-sm"
                            >
                              <span>Actions</span>
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {showUserActions === user.id && (
                              <div className="admin-dropdown-menu">
                                <button
                                  onClick={() => {
                                    handleReviewKyc(user)
                                    setShowUserActions(null)
                                  }}
                                  className="admin-dropdown-item"
                                >
                                  <Eye className="w-4 h-4 text-[var(--admin-sky)]" />
                                  <span>Réviser KYC</span>
                                </button>
                                
                                <div className="admin-dropdown-divider"></div>
                                
                                <button
                                  onClick={() => handleUserAction(user, 'edit')}
                                  className="admin-dropdown-item"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Modifier</span>
                                </button>
                                
                                <button
                                  onClick={() => handleUserAction(user, 'activate')}
                                  className="admin-dropdown-item"
                                >
                                  <UserCheck className="w-4 h-4 text-[var(--admin-emerald)]" />
                                  <span>Activer</span>
                                </button>
                                
                                <button
                                  onClick={() => handleUserAction(user, 'suspend')}
                                  className="admin-dropdown-item"
                                >
                                  <Ban className="w-4 h-4 text-[var(--admin-amber)]" />
                                  <span>Suspendre</span>
                                </button>
                                
                                <button
                                  onClick={() => handleUserAction(user, 'archive')}
                                  className="admin-dropdown-item"
                                >
                                  <Archive className="w-4 h-4 text-[var(--admin-violet)]" />
                                  <span>Archiver</span>
                                </button>
                                
                                <div className="admin-dropdown-divider"></div>
                                
                                <button
                                  onClick={() => handleUserAction(user, 'delete')}
                                  className="admin-dropdown-item admin-dropdown-item-danger"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Supprimer</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="admin-grid admin-grid-4">
              <button 
                className={`admin-stat-card ${!transactionStatusFilter ? 'active' : ''}`}
                data-color="gold"
                onClick={() => { setTransactionStatusFilter(''); setTransactionTypeFilter(''); }}
              >
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Total</span>
                  <div className="admin-stat-icon"><CreditCard className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value">{transactions.length}</div>
              </button>
              <button 
                className={`admin-stat-card ${transactionStatusFilter === 'PENDING' ? 'active' : ''}`}
                data-color="amber"
                onClick={() => setTransactionStatusFilter(transactionStatusFilter === 'PENDING' ? '' : 'PENDING')}
              >
                <div className="admin-stat-header">
                  <span className="admin-stat-label">En attente</span>
                  <div className="admin-stat-icon"><Clock className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value colored">{transactions.filter(t => t.status === 'PENDING').length}</div>
              </button>
              <button 
                className={`admin-stat-card ${transactionStatusFilter === 'PROCESSING' ? 'active' : ''}`}
                data-color="sky"
                onClick={() => setTransactionStatusFilter(transactionStatusFilter === 'PROCESSING' ? '' : 'PROCESSING')}
              >
                <div className="admin-stat-header">
                  <span className="admin-stat-label">En cours</span>
                  <div className="admin-stat-icon"><TrendingUp className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value colored">{transactions.filter(t => t.status === 'PROCESSING').length}</div>
              </button>
              <button 
                className={`admin-stat-card ${transactionStatusFilter === 'COMPLETED' ? 'active' : ''}`}
                data-color="emerald"
                onClick={() => setTransactionStatusFilter(transactionStatusFilter === 'COMPLETED' ? '' : 'COMPLETED')}
              >
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Complétées</span>
                  <div className="admin-stat-icon"><CheckCircle className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value colored">{transactions.filter(t => t.status === 'COMPLETED').length}</div>
              </button>
            </div>

            {/* Table Card */}
            <div className="admin-card admin-animate-in">
              <div className="admin-card-header">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                  <div className="flex items-center gap-3">
                    <h3 className="admin-card-title">
                      <CreditCard className="admin-card-title-icon" />
                      Gestion des transactions
                    </h3>
                    {(transactionStatusFilter || transactionTypeFilter) && (
                      <span className="admin-filter-chip">
                        {transactionStatusFilter && `Statut: ${
                          transactionStatusFilter === 'COMPLETED' ? 'Complété' :
                          transactionStatusFilter === 'PENDING' ? 'En attente' :
                          transactionStatusFilter === 'PROCESSING' ? 'En cours' : transactionStatusFilter
                        }`}
                        {transactionTypeFilter && ` Type: ${transactionTypeFilter === 'DEPOSIT' ? 'Dépôt' : 'Investissement'}`}
                        <button 
                          onClick={() => { setTransactionStatusFilter(''); setTransactionTypeFilter(''); }}
                          className="admin-filter-chip-close"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={transactionTypeFilter}
                      onChange={(e) => setTransactionTypeFilter(e.target.value)}
                      className="admin-select"
                    >
                      <option value="">Tous les types</option>
                      <option value="DEPOSIT">Dépôts</option>
                      <option value="INVESTMENT">Investissements</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="admin-card-content p-0">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Référence</th>
                        <th>Utilisateur</th>
                        <th>Type</th>
                        <th>Montant</th>
                        <th>Statut</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions
                        .filter(t => !transactionStatusFilter || t.status === transactionStatusFilter)
                        .filter(t => !transactionTypeFilter || t.intentType === transactionTypeFilter)
                        .map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="admin-table-cell-mono">
                            {transaction.referenceNumber}
                          </td>
                          <td>
                            <div>
                              <div className="admin-table-cell-primary">{transaction.user.name}</div>
                              <div className="text-xs text-[var(--admin-text-muted)]">{transaction.user.email}</div>
                            </div>
                          </td>
                          <td>
                            <span className={`admin-badge ${
                              transaction.intentType === 'DEPOSIT' ? 'admin-badge-gold' : 'admin-badge-info'
                            }`}>
                              {transaction.intentType === 'DEPOSIT' ? 'Dépôt' : 
                               transaction.intentType === 'INVESTMENT' ? 'Investissement' : transaction.intentType}
                            </span>
                          </td>
                          <td className="admin-table-cell-primary font-semibold">
                            {transaction.amount.toLocaleString('fr-FR')} <span className="text-[var(--admin-text-muted)] font-normal">FCFA</span>
                          </td>
                          <td>
                            <span className={`admin-badge ${
                              transaction.status === 'COMPLETED' ? 'admin-badge-success' :
                              transaction.status === 'PENDING' ? 'admin-badge-warning' :
                              transaction.status === 'PROCESSING' ? 'admin-badge-info' :
                              'admin-badge-danger'
                            }`}>
                              <span className="admin-badge-dot"></span>
                              {transaction.status === 'COMPLETED' ? 'Complété' :
                               transaction.status === 'PENDING' ? 'En attente' :
                               transaction.status === 'PROCESSING' ? 'En cours' : 'Échoué'}
                            </span>
                          </td>
                          <td className="admin-table-cell-mono">
                            {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td>
                            <div className="flex gap-2">
                              {transaction.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={() => updateTransactionStatus(transaction.id, 'PROCESSING')}
                                    className="admin-btn admin-btn-secondary admin-btn-sm"
                                  >
                                    Traiter
                                  </button>
                                  <button
                                    onClick={() => updateTransactionStatus(transaction.id, 'COMPLETED')}
                                    className="admin-btn admin-btn-success admin-btn-sm"
                                  >
                                    Compléter
                                  </button>
                                </>
                              )}
                              {transaction.status === 'PROCESSING' && (
                                <button
                                  onClick={() => updateTransactionStatus(transaction.id, 'COMPLETED')}
                                  className="admin-btn admin-btn-success admin-btn-sm"
                                >
                                  Compléter
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {transactions
                    .filter(t => !transactionStatusFilter || t.status === transactionStatusFilter)
                    .filter(t => !transactionTypeFilter || t.intentType === transactionTypeFilter)
                    .length === 0 && (
                    <div className="admin-empty">
                      <CreditCard className="admin-empty-icon" />
                      <p className="admin-empty-title">Aucune transaction trouvée</p>
                      <p className="admin-empty-text">Les transactions apparaîtront ici</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KYC Tab */}
        {activeTab === 'kyc' && (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="admin-grid admin-grid-4">
              <div className="admin-stat-card" data-color="gold">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Total documents</span>
                  <div className="admin-stat-icon"><FileText className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value">{kycDocuments.length}</div>
              </div>
              <div className="admin-stat-card" data-color="amber">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">En attente</span>
                  <div className="admin-stat-icon"><Clock className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value colored">{kycDocuments.filter(d => d.verificationStatus === 'PENDING').length}</div>
              </div>
              <div className="admin-stat-card" data-color="emerald">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Approuvés</span>
                  <div className="admin-stat-icon"><CheckCircle className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value colored">{kycDocuments.filter(d => d.verificationStatus === 'APPROVED').length}</div>
              </div>
              <div className="admin-stat-card" data-color="rose">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Rejetés</span>
                  <div className="admin-stat-icon"><XCircle className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value colored">{kycDocuments.filter(d => d.verificationStatus === 'REJECTED').length}</div>
              </div>
            </div>

            {/* Header with user selection */}
            {selectedUser && (
              <div className="admin-card admin-animate-in">
                <div className="admin-card-header">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--admin-primary-bg)] flex items-center justify-center">
                        <Eye className="w-5 h-5 text-[var(--admin-primary)]" />
                      </div>
                      <div>
                        <h3 className="admin-card-title mb-0">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </h3>
                        <p className="text-sm text-[var(--admin-text-muted)]">
                          {selectedUser.email} • {selectedUser.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="admin-btn admin-btn-secondary"
                      >
                        Voir tous les utilisateurs
                      </button>
                      {userKycDocuments.some(doc => doc.verificationStatus === 'PENDING') && (
                        <button
                          onClick={() => handleBulkValidate(selectedUser.id, 'APPROVED')}
                          disabled={bulkValidating}
                          className="admin-btn admin-btn-success"
                        >
                          {bulkValidating ? (
                            <>
                              <RotateCcw className="w-4 h-4 animate-spin" />
                              {bulkOperationProgress
                                ? `${bulkOperationProgress.current}/${bulkOperationProgress.total}`
                                : 'Validation...'
                              }
                            </>
                          ) : (
                            'Tout valider'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User selection or document list */}
            {!selectedUser ? (
              <div className="admin-card admin-animate-in">
                <div className="admin-card-header">
                  <h3 className="admin-card-title">
                    <FileText className="admin-card-title-icon" />
                    Vérification des documents KYC
                  </h3>
                </div>
                <div className="admin-card-content">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.filter(user => user.stats.totalKycDocuments > 0).map((user) => (
                      <div 
                        key={user.id} 
                        className="p-4 rounded-lg border border-[var(--admin-border-light)] hover:border-[var(--admin-primary)] hover:bg-[var(--admin-bg-tertiary)] transition-all cursor-pointer"
                        onClick={() => handleReviewKyc(user)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-[var(--admin-text-primary)]">
                              {user.firstName} {user.lastName}
                            </h4>
                            <p className="text-sm text-[var(--admin-text-muted)]">{user.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-[var(--admin-text-muted)]">
                                {user.stats.totalKycDocuments} document(s)
                              </span>
                              <span className={`admin-badge admin-badge-sm ${
                                user.kycStatus === 'APPROVED' ? 'admin-badge-success' :
                                user.kycStatus === 'REJECTED' ? 'admin-badge-danger' :
                                user.kycStatus === 'UNDER_REVIEW' ? 'admin-badge-info' :
                                'admin-badge-warning'
                              }`}>
                                {user.kycStatus === 'UNDER_REVIEW' ? 'En révision' : 
                                 user.kycStatus === 'APPROVED' ? 'Approuvé' :
                                 user.kycStatus === 'REJECTED' ? 'Rejeté' :
                                 user.kycStatus === 'PENDING' ? 'En attente' : user.kycStatus}
                              </span>
                            </div>
                          </div>
                          <button className="admin-btn admin-btn-primary admin-btn-sm">
                            Réviser
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {users.filter(user => user.stats.totalKycDocuments > 0).length === 0 && (
                    <div className="admin-empty">
                      <FileText className="admin-empty-icon" />
                      <p className="admin-empty-title">Aucun document KYC</p>
                      <p className="admin-empty-text">Les documents KYC apparaîtront ici</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="admin-card admin-animate-in">
                <div className="admin-card-header">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                    <h3 className="admin-card-title">
                      <FileText className="admin-card-title-icon" />
                      Documents de {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-[var(--admin-text-muted)]">Total: <strong>{userKycDocuments.length}</strong></span>
                      <span className="text-[var(--admin-amber)]">En attente: <strong>{userKycDocuments.filter(doc => doc.verificationStatus === 'PENDING').length}</strong></span>
                      <span className="text-[var(--admin-emerald)]">Approuvés: <strong>{userKycDocuments.filter(doc => doc.verificationStatus === 'APPROVED').length}</strong></span>
                      <span className="text-[var(--admin-rose)]">Rejetés: <strong>{userKycDocuments.filter(doc => doc.verificationStatus === 'REJECTED').length}</strong></span>
                    </div>
                  </div>
                </div>
                <div className="admin-card-content">
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
                    <div className="admin-empty">
                      <FileText className="admin-empty-icon" />
                      <p className="admin-empty-title">Aucun document KYC</p>
                      <p className="admin-empty-text">Les documents de cet utilisateur apparaîtront ici</p>
                    </div>
                  )}
                </div>
              </div>
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

        {/* Reconciliation Tab */}
        {activeTab === 'reconciliation' && (
          <IntouchReconciliation
            onReconcile={async (matches) => {
              const token = localStorage.getItem('admin_token')
              const response = await fetch('/api/admin/ape-subscriptions/reconcile', {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ matches }),
              })
              const data = await response.json()
              if (!data.success) {
                throw new Error(data.error)
              }
              // Refresh APE subscriptions data
              await fetchDashboardData()
            }}
          />
        )}

        {/* APE Subscriptions Tab */}
        {activeTab === 'apeSubscriptions' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="admin-grid admin-grid-6">
              <div 
                className={`admin-stat-card admin-animate-in ${!apeStatusFilter ? 'active' : ''}`} 
                data-color="gold"
                onClick={() => setApeStatusFilter('')}
              >
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Total</span>
                  <div className="admin-stat-icon">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                </div>
                <div className="admin-stat-value">{apeStats.total}</div>
              </div>
              
              <div 
                className={`admin-stat-card admin-animate-in ${apeStatusFilter === 'PENDING' ? 'active' : ''}`}
                data-color="amber"
                onClick={() => setApeStatusFilter('PENDING')}
              >
                <div className="admin-stat-header">
                  <span className="admin-stat-label">En attente</span>
                  <div className="admin-stat-icon">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="admin-stat-value colored">{apeStats.pending}</div>
              </div>
              
              <div 
                className={`admin-stat-card admin-animate-in ${apeStatusFilter === 'PAYMENT_INITIATED' ? 'active' : ''}`}
                data-color="sky"
                onClick={() => setApeStatusFilter('PAYMENT_INITIATED')}
              >
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Initié</span>
                  <div className="admin-stat-icon">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <div className="admin-stat-value colored">{apeStats.paymentInitiated}</div>
              </div>
              
              <div 
                className={`admin-stat-card admin-animate-in ${apeStatusFilter === 'PAYMENT_SUCCESS' ? 'active' : ''}`}
                data-color="emerald"
                onClick={() => setApeStatusFilter('PAYMENT_SUCCESS')}
              >
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Payé</span>
                  <div className="admin-stat-icon">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="admin-stat-value colored">{apeStats.paymentSuccess}</div>
              </div>
              
              <div 
                className={`admin-stat-card admin-animate-in ${apeStatusFilter === 'PAYMENT_FAILED' ? 'active' : ''}`}
                data-color="rose"
                onClick={() => setApeStatusFilter('PAYMENT_FAILED')}
              >
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Échoué</span>
                  <div className="admin-stat-icon">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="admin-stat-value colored">{apeStats.paymentFailed}</div>
              </div>
              
              <div className="admin-stat-card admin-animate-in" data-color="emerald">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Collecté</span>
                  <div className="admin-stat-icon">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>
                <div className="admin-stat-value colored text-xl">{apeStats.totalAmount.toLocaleString('fr-FR')}</div>
                <div className="text-xs text-[var(--admin-text-muted)] mt-1">FCFA</div>
              </div>
            </div>

            {/* Export and Filter Controls */}
            <div className="admin-card admin-animate-in" style={{ animationDelay: '300ms' }}>
              <div className="admin-card-header">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                  <div className="flex items-center gap-3">
                    <h3 className="admin-card-title">
                      <FileSpreadsheet className="admin-card-title-icon" />
                      Souscriptions APE
                    </h3>
                    {apeStatusFilter && (
                      <span className="admin-filter-chip">
                        Filtre: {apeStatusFilter === 'PAYMENT_SUCCESS' ? 'Payé' :
                                 apeStatusFilter === 'PENDING' ? 'En attente' :
                                 apeStatusFilter === 'PAYMENT_INITIATED' ? 'Initié' :
                                 apeStatusFilter === 'PAYMENT_FAILED' ? 'Échoué' : apeStatusFilter}
                        <button 
                          onClick={() => setApeStatusFilter('')}
                          className="admin-filter-chip-close"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        setExportingApe(true)
                        try {
                          const token = localStorage.getItem('admin_token')
                          const statusParam = apeStatusFilter ? `&status=${apeStatusFilter}` : ''
                          const response = await fetch(`/api/admin/ape-subscriptions?format=csv${statusParam}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                          })
                          const data = await response.json()
                          if (data.success) {
                            // Generate CSV
                            const headers = ['Référence', 'Civilité', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Pays', 'Ville', 'Catégorie', 'Tranche', 'Montant (FCFA)', 'Code Parrainage', 'Statut', 'Date création']
                            const rows = data.subscriptions.map((sub: ApeSubscription) => [
                              sub.referenceNumber,
                              sub.civilite,
                              sub.prenom,
                              sub.nom,
                              sub.email,
                              sub.telephone,
                              sub.paysResidence,
                              sub.ville,
                              sub.categorieSocioprofessionnelle,
                              sub.trancheInteresse,
                              sub.montantCfa,
                              sub.codeParrainage || '',
                              sub.status,
                              new Date(sub.createdAt).toLocaleDateString('fr-FR')
                            ])
                            const csvContent = [headers, ...rows].map(row => row.map((cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
                            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
                            const url = URL.createObjectURL(blob)
                            const link = document.createElement('a')
                            link.href = url
                            link.download = `ape-subscriptions-${new Date().toISOString().split('T')[0]}.csv`
                            link.click()
                            URL.revokeObjectURL(url)
                          }
                        } catch (error) {
                          console.error('Export error:', error)
                          alert('Erreur lors de l\'export')
                        } finally {
                          setExportingApe(false)
                        }
                      }}
                      disabled={exportingApe}
                      className="admin-btn admin-btn-success"
                    >
                      <Download className="w-4 h-4" />
                      {exportingApe ? 'Export...' : 'CSV'}
                    </button>
                    <button
                      onClick={async () => {
                        setExportingApe(true)
                        try {
                          const token = localStorage.getItem('admin_token')
                          const statusParam = apeStatusFilter ? `&status=${apeStatusFilter}` : ''
                          const response = await fetch(`/api/admin/ape-subscriptions?format=xlsx${statusParam}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                          })
                          const data = await response.json()
                          if (data.success) {
                            const headers = ['Référence', 'Civilité', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Pays', 'Ville', 'Catégorie', 'Tranche', 'Montant (FCFA)', 'Code Parrainage', 'Statut', 'Transaction ID', 'Date création', 'Date paiement']
                            const rows = data.subscriptions.map((sub: ApeSubscription) => [
                              sub.referenceNumber,
                              sub.civilite,
                              sub.prenom,
                              sub.nom,
                              sub.email,
                              sub.telephone,
                              sub.paysResidence,
                              sub.ville,
                              sub.categorieSocioprofessionnelle,
                              sub.trancheInteresse,
                              sub.montantCfa,
                              sub.codeParrainage || '',
                              sub.status,
                              sub.providerTransactionId || '',
                              new Date(sub.createdAt).toLocaleDateString('fr-FR'),
                              sub.paymentCompletedAt ? new Date(sub.paymentCompletedAt).toLocaleDateString('fr-FR') : ''
                            ])
                            const tsvContent = [headers, ...rows].map(row => row.join('\t')).join('\n')
                            const blob = new Blob(['\ufeff' + tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' })
                            const url = URL.createObjectURL(blob)
                            const link = document.createElement('a')
                            link.href = url
                            link.download = `ape-subscriptions-${new Date().toISOString().split('T')[0]}.xls`
                            link.click()
                            URL.revokeObjectURL(url)
                          }
                        } catch (error) {
                          console.error('Export error:', error)
                          alert('Erreur lors de l\'export')
                        } finally {
                          setExportingApe(false)
                        }
                      }}
                      disabled={exportingApe}
                      className="admin-btn admin-btn-primary"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      {exportingApe ? 'Export...' : 'Excel'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="admin-card-content p-0">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Référence</th>
                        <th>Souscripteur</th>
                        <th>Contact</th>
                        <th>Localisation</th>
                        <th>Tranche</th>
                        <th>Montant</th>
                        <th>Parrainage</th>
                        <th>Statut</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apeSubscriptions
                        .filter(sub => !apeStatusFilter || sub.status === apeStatusFilter)
                        .map((sub) => (
                        <tr key={sub.id}>
                          <td className="admin-table-cell-mono">
                            {sub.referenceNumber}
                          </td>
                          <td>
                            <div>
                              <div className="admin-table-cell-primary">
                                {sub.civilite} {sub.prenom} {sub.nom}
                              </div>
                              <div className="text-xs text-[var(--admin-text-muted)]">{sub.categorieSocioprofessionnelle}</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="text-[var(--admin-text-secondary)]">{sub.email}</div>
                              <div className="text-xs text-[var(--admin-text-muted)]">{sub.telephone}</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="text-[var(--admin-text-secondary)]">{sub.ville}</div>
                              <div className="text-xs text-[var(--admin-text-muted)]">{sub.paysResidence}</div>
                            </div>
                          </td>
                          <td className="text-[var(--admin-text-secondary)]">
                            {sub.trancheInteresse}
                          </td>
                          <td className="admin-table-cell-primary font-semibold">
                            {parseFloat(sub.montantCfa).toLocaleString('fr-FR')} <span className="text-[var(--admin-text-muted)] font-normal">FCFA</span>
                          </td>
                          <td className="admin-table-cell-mono">
                            {sub.codeParrainage || '-'}
                          </td>
                          <td>
                            <span className={`admin-badge ${
                              sub.status === 'PAYMENT_SUCCESS' ? 'admin-badge-success' :
                              sub.status === 'PENDING' ? 'admin-badge-warning' :
                              sub.status === 'PAYMENT_INITIATED' ? 'admin-badge-info' :
                              sub.status === 'PAYMENT_FAILED' ? 'admin-badge-danger' :
                              'admin-badge-neutral'
                            }`}>
                              <span className="admin-badge-dot"></span>
                              {sub.status === 'PAYMENT_SUCCESS' ? 'Payé' :
                               sub.status === 'PENDING' ? 'En attente' :
                               sub.status === 'PAYMENT_INITIATED' ? 'Initié' :
                               sub.status === 'PAYMENT_FAILED' ? 'Échoué' :
                               sub.status === 'CANCELLED' ? 'Annulé' : sub.status}
                            </span>
                          </td>
                          <td className="admin-table-cell-mono">
                            {new Date(sub.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td>
                            <button
                              onClick={() => openApeStatusModal(sub)}
                              className={`admin-btn admin-btn-sm ${
                                sub.status === 'PAYMENT_INITIATED' 
                                  ? 'admin-btn-warning' 
                                  : 'admin-btn-ghost'
                              }`}
                              title="Modifier le statut"
                            >
                              <Edit className="w-4 h-4" />
                              {sub.status === 'PAYMENT_INITIATED' && (
                                <span className="hidden sm:inline ml-1">Réconcilier</span>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {apeSubscriptions.filter(sub => !apeStatusFilter || sub.status === apeStatusFilter).length === 0 && (
                    <div className="admin-empty">
                      <FileSpreadsheet className="admin-empty-icon" />
                      <p className="admin-empty-title">Aucune souscription APE trouvée</p>
                      <p className="admin-empty-text">Les souscriptions apparaîtront ici une fois créées</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sponsor Codes Tab */}
        {activeTab === 'sponsorCodes' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="admin-grid admin-grid-4">
              <div className="admin-stat-card" data-color="sky">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Total codes</span>
                  <div className="admin-stat-icon"><Gift className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value">{sponsorCodeStats.total}</div>
              </div>
              <div className="admin-stat-card" data-color="emerald">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Codes actifs</span>
                  <div className="admin-stat-icon"><CheckCircle className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value colored">{sponsorCodeStats.active}</div>
              </div>
              <div className="admin-stat-card" data-color="neutral">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Codes inactifs</span>
                  <div className="admin-stat-icon"><XCircle className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value">{sponsorCodeStats.inactive}</div>
              </div>
              <div className="admin-stat-card" data-color="rose">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Codes expirés</span>
                  <div className="admin-stat-icon"><Clock className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value">{sponsorCodeStats.expired}</div>
              </div>
            </div>

            {/* Sponsor Codes Table */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Codes de parrainage</h3>
                  <p className="admin-card-subtitle">Gérez les codes de parrainage pour APE Sénégal</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={sponsorCodeStatusFilter}
                    onChange={(e) => setSponsorCodeStatusFilter(e.target.value)}
                    className="admin-select"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="ACTIVE">Actifs</option>
                    <option value="INACTIVE">Inactifs</option>
                    <option value="EXPIRED">Expirés</option>
                  </select>
                  <button
                    onClick={() => {
                      setNewCodeData({ code: '', description: '', maxUsage: '', expiresAt: '' })
                      setShowCreateCodeModal(true)
                    }}
                    className="admin-btn admin-btn-primary"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Nouveau code
                  </button>
                </div>
              </div>
              <div className="admin-card-body p-0">
                <div className="admin-table-container">
                  {sponsorCodes.filter(code => !sponsorCodeStatusFilter || code.status === sponsorCodeStatusFilter).length > 0 ? (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Description</th>
                          <th>Statut</th>
                          <th>Utilisations</th>
                          <th>Limite</th>
                          <th>Expiration</th>
                          <th>Créé par</th>
                          <th>Date création</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sponsorCodes
                          .filter(code => !sponsorCodeStatusFilter || code.status === sponsorCodeStatusFilter)
                          .map((code) => {
                            const statusConfig = SPONSOR_CODE_STATUS_CONFIG[code.status as keyof typeof SPONSOR_CODE_STATUS_CONFIG] || { label: code.status, color: 'neutral' }
                            return (
                              <tr key={code.id}>
                                <td>
                                  <span className="font-mono font-semibold text-[var(--admin-primary)]">{code.code}</span>
                                </td>
                                <td>
                                  <span className="text-sm text-[var(--admin-text-muted)]">
                                    {code.description || '-'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`admin-badge admin-badge-${statusConfig.color}`}>
                                    {statusConfig.label}
                                  </span>
                                </td>
                                <td>
                                  <span className="font-medium">{code.usageCount}</span>
                                </td>
                                <td>
                                  <span className="text-sm">
                                    {code.maxUsage ? code.maxUsage : 'Illimité'}
                                  </span>
                                </td>
                                <td>
                                  <span className="text-sm">
                                    {code.expiresAt 
                                      ? new Date(code.expiresAt).toLocaleDateString('fr-FR')
                                      : 'Jamais'}
                                  </span>
                                </td>
                                <td>
                                  <span className="text-sm">
                                    {code.createdByAdmin?.name || '-'}
                                  </span>
                                </td>
                                <td>
                                  <span className="text-sm text-[var(--admin-text-muted)]">
                                    {new Date(code.createdAt).toLocaleDateString('fr-FR')}
                                  </span>
                                </td>
                                <td>
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => openEditCodeModal(code)}
                                      className="admin-btn admin-btn-ghost admin-btn-sm"
                                      title="Modifier"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleToggleSponsorCodeStatus(code)}
                                      className={`admin-btn admin-btn-ghost admin-btn-sm ${code.status === 'ACTIVE' ? 'text-amber-600' : 'text-emerald-600'}`}
                                      title={code.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
                                      disabled={code.status === 'EXPIRED'}
                                    >
                                      {code.status === 'ACTIVE' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSponsorCode(code)}
                                      className="admin-btn admin-btn-ghost admin-btn-sm text-rose-600"
                                      title="Supprimer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="admin-empty-state">
                      <Gift className="admin-empty-icon" />
                      <p className="admin-empty-title">Aucun code de parrainage</p>
                      <p className="admin-empty-text">Créez votre premier code de parrainage</p>
                      <button
                        onClick={() => {
                          setNewCodeData({ code: '', description: '', maxUsage: '', expiresAt: '' })
                          setShowCreateCodeModal(true)
                        }}
                        className="admin-btn admin-btn-primary mt-4"
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Créer un code
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PEE Leads Tab */}
        {activeTab === 'peeLeads' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="admin-grid admin-grid-4">
              <div className="admin-stat-card" data-color="sky">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Total leads</span>
                  <div className="admin-stat-icon"><GraduationCap className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value">{peeLeadStats.total}</div>
              </div>
              <div className="admin-stat-card" data-color="amber">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Nouveaux</span>
                  <div className="admin-stat-icon"><Clock className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value colored">{peeLeadStats.new}</div>
              </div>
              <div className="admin-stat-card" data-color="blue">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Contactés</span>
                  <div className="admin-stat-icon"><Phone className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value">{peeLeadStats.contacted}</div>
              </div>
              <div className="admin-stat-card" data-color="emerald">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Convertis</span>
                  <div className="admin-stat-icon"><CheckCircle className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value colored">{peeLeadStats.converted}</div>
              </div>
            </div>

            {/* PEE Leads Table */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Leads PEE (Plan Épargne Éducation)</h3>
                  <p className="admin-card-subtitle">Gérez les demandes de renseignements PEE</p>
                </div>
              </div>
              <div className="admin-card-body p-0">
                <div className="admin-table-container">
                  {peeLeads.length > 0 ? (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Contact</th>
                          <th>Catégorie</th>
                          <th>Localisation</th>
                          <th>Statut</th>
                          <th>Date</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {peeLeads.map((lead) => (
                          <tr key={lead.id}>
                            <td>
                              <div>
                                <div className="font-semibold">{lead.civilite} {lead.prenom} {lead.nom}</div>
                              </div>
                            </td>
                            <td>
                              <div className="text-sm">
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {lead.telephone}
                                </div>
                                {lead.email && (
                                  <div className="flex items-center gap-1 text-[var(--admin-text-muted)]">
                                    <Mail className="w-3 h-3" />
                                    {lead.email}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className="admin-badge admin-badge-neutral">{lead.categorie}</span>
                            </td>
                            <td>
                              <div className="text-sm">
                                <div>{lead.ville}</div>
                                <div className="text-[var(--admin-text-muted)]">{lead.pays}</div>
                              </div>
                            </td>
                            <td>
                              <span className={`admin-badge ${
                                lead.status === 'NEW' ? 'admin-badge-amber' :
                                lead.status === 'CONTACTED' ? 'admin-badge-blue' :
                                lead.status === 'CONVERTED' ? 'admin-badge-emerald' :
                                'admin-badge-neutral'
                              }`}>
                                {lead.status === 'NEW' ? 'Nouveau' :
                                 lead.status === 'CONTACTED' ? 'Contacté' :
                                 lead.status === 'CONVERTED' ? 'Converti' :
                                 lead.status}
                              </span>
                            </td>
                            <td>
                              <div className="text-sm text-[var(--admin-text-muted)]">
                                {new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </div>
                            </td>
                            <td className="text-right">
                              <button
                                onClick={() => {
                                  setSelectedPeeLead(lead)
                                  setPeeLeadNotes(lead.adminNotes || '')
                                  setShowPeeLeadModal(true)
                                }}
                                className="admin-btn admin-btn-sm admin-btn-secondary"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Gérer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="admin-empty-state">
                      <GraduationCap className="admin-empty-icon" />
                      <h3 className="admin-empty-title">Aucun lead PEE</h3>
                      <p className="admin-empty-text">Les demandes PEE apparaîtront ici</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="admin-grid admin-grid-3">
              <div className="admin-stat-card" data-color="sky">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Notifications envoyées</span>
                  <div className="admin-stat-icon"><MessageSquare className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value">-</div>
                <div className="text-xs text-[var(--admin-text-muted)] mt-1">Aujourd&apos;hui</div>
              </div>
              <div className="admin-stat-card" data-color="emerald">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Taux de livraison</span>
                  <div className="admin-stat-icon"><CheckCircle className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value colored">-</div>
                <div className="text-xs text-[var(--admin-text-muted)] mt-1">Moyenne</div>
              </div>
              <div className="admin-stat-card" data-color="amber">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">En attente</span>
                  <div className="admin-stat-icon"><Clock className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value colored">-</div>
                <div className="text-xs text-[var(--admin-text-muted)] mt-1">À envoyer</div>
              </div>
            </div>

            {/* Notification Management Card */}
            <div className="admin-card admin-animate-in">
              <div className="admin-card-header">
                <h3 className="admin-card-title">
                  <MessageSquare className="admin-card-title-icon" />
                  Envoyer une notification KYC
                </h3>
              </div>
              <div className="admin-card-content">
                <NotificationManagement />
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Settings Header */}
            <div className="admin-grid admin-grid-2">
              <div className="admin-stat-card" data-color="gold">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Configuration</span>
                  <div className="admin-stat-icon"><Settings className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value text-lg">Notifications</div>
                <div className="text-xs text-[var(--admin-text-muted)] mt-1">Paramètres système</div>
              </div>
              <div className="admin-stat-card" data-color="emerald">
                <div className="admin-stat-header">
                  <span className="admin-stat-label">Statut</span>
                  <div className="admin-stat-icon"><CheckCircle className="w-5 h-5" /></div>
                </div>
                <div className="admin-stat-value colored text-lg">Actif</div>
                <div className="text-xs text-[var(--admin-text-muted)] mt-1">Système opérationnel</div>
              </div>
            </div>

            {/* Settings Card */}
            <div className="admin-card admin-animate-in">
              <div className="admin-card-header">
                <h3 className="admin-card-title">
                  <Settings className="admin-card-title-icon" />
                  Paramètres des notifications
                </h3>
              </div>
              <div className="admin-card-content">
                <NotificationSettings />
              </div>
            </div>
          </div>
        )}

        {/* APE Status Update Modal */}
        {showApeStatusModal && selectedApeSubscription && (
          <div className="admin-modal-overlay" onClick={() => setShowApeStatusModal(false)}>
            <div className="admin-modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3 className="admin-modal-title">
                  {selectedApeSubscription.status === 'PAYMENT_INITIATED' 
                    ? 'Réconciliation Intouch' 
                    : 'Modifier le statut'}
                </h3>
                <button 
                  onClick={() => setShowApeStatusModal(false)}
                  className="admin-modal-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="admin-modal-body">
                {/* Subscription Info */}
                <div className="mb-3 p-2.5 bg-[var(--admin-bg-tertiary)] rounded-lg border border-[var(--admin-border-light)]">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-semibold text-[var(--admin-text-primary)]">
                      {selectedApeSubscription.civilite} {selectedApeSubscription.prenom} {selectedApeSubscription.nom}
                    </div>
                    <span className={`admin-badge admin-badge-sm ${
                      selectedApeSubscription.status === 'PAYMENT_SUCCESS' ? 'admin-badge-success' :
                      selectedApeSubscription.status === 'PAYMENT_INITIATED' ? 'admin-badge-info' :
                      selectedApeSubscription.status === 'PAYMENT_FAILED' ? 'admin-badge-danger' :
                      'admin-badge-warning'
                    }`}>
                      {APE_STATUS_CONFIG[selectedApeSubscription.status as keyof typeof APE_STATUS_CONFIG]?.label || selectedApeSubscription.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-[var(--admin-text-muted)]">
                    <div><span className="font-medium">Réf:</span> {selectedApeSubscription.referenceNumber}</div>
                    <div><span className="font-medium">Montant:</span> {parseFloat(selectedApeSubscription.montantCfa).toLocaleString('fr-FR')} FCFA</div>
                  </div>
                </div>

                {/* Status Selection */}
                <div className="mb-3">
                  <label className="admin-label text-sm font-semibold">Nouveau statut</label>
                  <div className="admin-status-select" style={{ gap: '0.5rem' }}>
                    {Object.entries(APE_STATUS_CONFIG).map(([status, config]) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setNewApeStatus(status)}
                        className={`admin-status-option ${newApeStatus === status ? 'selected' : ''}`}
                      >
                        <div 
                          className="admin-status-option-icon"
                          style={{ 
                            background: `var(--admin-${config.color}-bg)`,
                            color: `var(--admin-${config.color})`
                          }}
                        >
                          {status === 'PENDING' && <Clock className="w-5 h-5" />}
                          {status === 'PAYMENT_INITIATED' && <CreditCard className="w-5 h-5" />}
                          {status === 'PAYMENT_SUCCESS' && <CheckCircle className="w-5 h-5" />}
                          {status === 'PAYMENT_FAILED' && <AlertCircle className="w-5 h-5" />}
                          {status === 'CANCELLED' && <XCircle className="w-5 h-5" />}
                        </div>
                        <div className="admin-status-option-content">
                          <div className="admin-status-option-label">{config.label}</div>
                          <div className="admin-status-option-desc">{config.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Provider Transaction ID */}
                <div className="mb-3">
                  <label className="admin-label text-sm font-semibold" htmlFor="apeProviderTransactionId">
                    Transaction ID Intouch <span className="text-[var(--admin-text-muted)] font-normal">(optionnel)</span>
                  </label>
                  <input
                    type="text"
                    id="apeProviderTransactionId"
                    value={apeProviderTransactionId}
                    onChange={(e) => setApeProviderTransactionId(e.target.value)}
                    placeholder="Ex: MP251219.1145.D54113"
                    className="admin-input"
                  />
                  <p className="text-xs text-[var(--admin-text-muted)] mt-0.5">
                    📋 ID depuis le rapport CSV Intouch
                  </p>
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="admin-label text-sm font-semibold" htmlFor="apeStatusNotes">
                    Notes <span className="text-[var(--admin-text-muted)] font-normal">(optionnel)</span>
                  </label>
                  <textarea
                    id="apeStatusNotes"
                    value={apeStatusNotes}
                    onChange={(e) => setApeStatusNotes(e.target.value)}
                    placeholder="Raison de la modification, source de vérification, etc."
                    className="admin-input"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="admin-modal-footer">
                <button
                  onClick={() => setShowApeStatusModal(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateApeStatus}
                  disabled={updatingApeStatus || newApeStatus === selectedApeSubscription.status}
                  className="admin-btn admin-btn-primary"
                >
                  {updatingApeStatus ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    'Mettre à jour'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Sponsor Code Modal */}
        {showCreateCodeModal && (
          <div className="admin-modal-overlay" onClick={() => setShowCreateCodeModal(false)}>
            <div className="admin-modal" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3 className="admin-modal-title">Nouveau code de parrainage</h3>
                <button onClick={() => setShowCreateCodeModal(false)} className="admin-modal-close">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="admin-modal-body">
                <div className="mb-4">
                  <label className="admin-label" htmlFor="newCode">
                    Code *
                  </label>
                  <input
                    id="newCode"
                    type="text"
                    value={newCodeData.code}
                    onChange={(e) => setNewCodeData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="Ex: PARRAIN2024"
                    className="admin-input font-mono"
                    maxLength={20}
                  />
                  <p className="text-xs text-[var(--admin-text-muted)] mt-1">
                    Le code sera automatiquement converti en majuscules
                  </p>
                </div>

                <div className="mb-4">
                  <label className="admin-label" htmlFor="codeDescription">
                    Description (optionnel)
                  </label>
                  <input
                    id="codeDescription"
                    type="text"
                    value={newCodeData.description}
                    onChange={(e) => setNewCodeData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Ex: Code pour la campagne diaspora"
                    className="admin-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="admin-label" htmlFor="maxUsage">
                      Limite d&apos;utilisation
                    </label>
                    <input
                      id="maxUsage"
                      type="number"
                      min="1"
                      value={newCodeData.maxUsage}
                      onChange={(e) => setNewCodeData(prev => ({ ...prev, maxUsage: e.target.value }))}
                      placeholder="Illimité"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label" htmlFor="expiresAt">
                      Date d&apos;expiration
                    </label>
                    <input
                      id="expiresAt"
                      type="date"
                      value={newCodeData.expiresAt}
                      onChange={(e) => setNewCodeData(prev => ({ ...prev, expiresAt: e.target.value }))}
                      className="admin-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>
              
              <div className="admin-modal-footer">
                <button
                  onClick={() => setShowCreateCodeModal(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateSponsorCode}
                  disabled={savingSponsorCode || !newCodeData.code.trim()}
                  className="admin-btn admin-btn-primary"
                >
                  {savingSponsorCode ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4 mr-2" />
                      Créer le code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Sponsor Code Modal */}
        {showEditCodeModal && selectedSponsorCode && (
          <div className="admin-modal-overlay" onClick={() => setShowEditCodeModal(false)}>
            <div className="admin-modal" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3 className="admin-modal-title">Modifier le code</h3>
                <button onClick={() => setShowEditCodeModal(false)} className="admin-modal-close">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="admin-modal-body">
                <div className="mb-4">
                  <label className="admin-label">
                    Code
                  </label>
                  <div className="admin-input bg-[var(--admin-bg-tertiary)] font-mono cursor-not-allowed">
                    {selectedSponsorCode.code}
                  </div>
                  <p className="text-xs text-[var(--admin-text-muted)] mt-1">
                    Le code ne peut pas être modifié
                  </p>
                </div>

                <div className="mb-4">
                  <label className="admin-label" htmlFor="editDescription">
                    Description
                  </label>
                  <input
                    id="editDescription"
                    type="text"
                    value={newCodeData.description}
                    onChange={(e) => setNewCodeData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Ex: Code pour la campagne diaspora"
                    className="admin-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="admin-label" htmlFor="editMaxUsage">
                      Limite d&apos;utilisation
                    </label>
                    <input
                      id="editMaxUsage"
                      type="number"
                      min="1"
                      value={newCodeData.maxUsage}
                      onChange={(e) => setNewCodeData(prev => ({ ...prev, maxUsage: e.target.value }))}
                      placeholder="Illimité"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label" htmlFor="editExpiresAt">
                      Date d&apos;expiration
                    </label>
                    <input
                      id="editExpiresAt"
                      type="date"
                      value={newCodeData.expiresAt}
                      onChange={(e) => setNewCodeData(prev => ({ ...prev, expiresAt: e.target.value }))}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[var(--admin-bg-tertiary)] rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--admin-text-muted)]">Utilisations actuelles:</span>
                    <span className="font-medium">{selectedSponsorCode.usageCount}</span>
                  </div>
                </div>
              </div>
              
              <div className="admin-modal-footer">
                <button
                  onClick={() => setShowEditCodeModal(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateSponsorCode}
                  disabled={savingSponsorCode}
                  className="admin-btn admin-btn-primary"
                >
                  {savingSponsorCode ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    'Enregistrer'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>

      {/* PEE Lead Management Modal */}
      {showPeeLeadModal && selectedPeeLead && (
        <div className="admin-modal-overlay" onClick={() => setShowPeeLeadModal(false)}>
          <div className="admin-modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                <GraduationCap className="w-5 h-5 mr-2" />
                Gérer le lead PEE
              </h3>
              <button
                onClick={() => setShowPeeLeadModal(false)}
                className="admin-modal-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Lead Info */}
              <div className="mb-6 p-4 bg-[var(--admin-card-bg)] rounded-lg border border-[var(--admin-border)]">
                <h4 className="font-semibold mb-3">Informations du prospect</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-[var(--admin-text-muted)]">Nom:</span>
                    <div className="font-medium">{selectedPeeLead.civilite} {selectedPeeLead.prenom} {selectedPeeLead.nom}</div>
                  </div>
                  <div>
                    <span className="text-[var(--admin-text-muted)]">Catégorie:</span>
                    <div className="font-medium">{selectedPeeLead.categorie}</div>
                  </div>
                  <div>
                    <span className="text-[var(--admin-text-muted)]">Téléphone:</span>
                    <div className="font-medium">{selectedPeeLead.telephone}</div>
                  </div>
                  <div>
                    <span className="text-[var(--admin-text-muted)]">Email:</span>
                    <div className="font-medium">{selectedPeeLead.email || 'Non renseigné'}</div>
                  </div>
                  <div>
                    <span className="text-[var(--admin-text-muted)]">Ville:</span>
                    <div className="font-medium">{selectedPeeLead.ville}</div>
                  </div>
                  <div>
                    <span className="text-[var(--admin-text-muted)]">Pays:</span>
                    <div className="font-medium">{selectedPeeLead.pays}</div>
                  </div>
                </div>
              </div>

              {/* Status Selection */}
              <div className="mb-4">
                <label className="admin-label">Statut du lead</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdatePeeLead('NEW')}
                    disabled={updatingPeeLead}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedPeeLead.status === 'NEW'
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <Clock className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                    <div className="text-sm font-medium">Nouveau</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdatePeeLead('CONTACTED')}
                    disabled={updatingPeeLead}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedPeeLead.status === 'CONTACTED'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Phone className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <div className="text-sm font-medium">Contacté</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdatePeeLead('CONVERTED')}
                    disabled={updatingPeeLead}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedPeeLead.status === 'CONVERTED'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <div className="text-sm font-medium">Converti</div>
                  </button>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="mb-4">
                <label className="admin-label" htmlFor="peeLeadNotes">
                  Notes administrateur
                </label>
                <textarea
                  id="peeLeadNotes"
                  value={peeLeadNotes}
                  onChange={(e) => setPeeLeadNotes(e.target.value)}
                  placeholder="Ajoutez des notes sur ce lead..."
                  className="admin-input"
                  rows={4}
                />
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                onClick={() => setShowPeeLeadModal(false)}
                className="admin-btn admin-btn-secondary"
                disabled={updatingPeeLead}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
