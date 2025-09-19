'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/common/Button'
import { 
  Users, 
  FileText, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  pendingKyc: number
  pendingTransactions: number
  completedTransactions: number
  totalDeposits: number
  totalInvestments: number
}

interface User {
  id: string
  email: string
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
    pendingTransactions: 0,
    completedTransactions: 0,
    totalDeposits: 0,
    totalInvestments: 0
  })
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [kycDocuments, setKycDocuments] = useState<KycDocument[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'transactions' | 'kyc'>('overview')
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    setAuthenticated(true)
    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
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
        const completedKyc = usersData.users.filter((u: User) => u.kycStatus === 'APPROVED').length
        
        setStats(prev => ({
          ...prev,
          totalUsers,
          pendingKyc,
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
  }

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

      const response = await fetch(`/api/admin/kyc/${documentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationStatus: status, adminNotes }),
      })

      if (response.ok) {
        await fetchDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Error updating KYC document status:', error)
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
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
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.kycStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.stats.totalTransactions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            size="sm"
                            onClick={() => updateKycStatus(user.id, 'APPROVED')}
                            className="bg-green-600 hover:bg-green-700 mr-2"
                          >
                            Approve KYC
                          </Button>
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
          <Card>
            <CardHeader>
              <CardTitle>KYC Document Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {kycDocuments.map((doc) => (
                      <tr key={doc.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{doc.user.name}</div>
                            <div className="text-sm text-gray-500">{doc.user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doc.documentType.replace('_', ' ').toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <a 
                            href={doc.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {doc.fileName}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            doc.verificationStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            doc.verificationStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            doc.verificationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {doc.verificationStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {doc.verificationStatus === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateKycDocumentStatus(doc.id, 'APPROVED')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => updateKycDocumentStatus(doc.id, 'REJECTED')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {doc.verificationStatus === 'APPROVED' && (
                            <span className="text-green-600 text-sm">✓ Approved</span>
                          )}
                          {doc.verificationStatus === 'REJECTED' && (
                            <span className="text-red-600 text-sm">✗ Rejected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {kycDocuments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No KYC documents found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
