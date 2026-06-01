'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import {
  EMPTY_APE_STATS,
  EMPTY_DASHBOARD_STATS,
  EMPTY_PEE_STATS,
  EMPTY_SPONSOR_STATS,
  type AdminTransaction,
  type AdminUser,
  type ApeStats,
  type ApeSubscription,
  type DashboardCardConfig,
  type DashboardStats,
  type KycDocument,
  type PeeLead,
  type PeeLeadStats,
  type SponsorCode,
  type SponsorCodeStats,
} from './types'

interface AdminDataContextValue {
  authenticated: boolean
  loading: boolean
  error: string | null
  stats: DashboardStats
  users: AdminUser[]
  transactions: AdminTransaction[]
  kycDocuments: KycDocument[]
  apeSubscriptions: ApeSubscription[]
  apeStats: ApeStats
  sponsorCodes: SponsorCode[]
  sponsorCodeStats: SponsorCodeStats
  peeLeads: PeeLead[]
  peeLeadStats: PeeLeadStats
  dashboardCards: DashboardCardConfig[]
  refresh: () => Promise<void>
  /** Re-fetch dashboard card layout only (no global loading flash). */
  refreshDashboardCards: () => Promise<void>
  /** fetch wrapper that injects the admin bearer token; redirects to login on 401 */
  authedFetch: (input: string, init?: RequestInit) => Promise<Response>
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null)

export function useAdminData(): AdminDataContextValue {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData must be used within <AdminDataProvider>')
  return ctx
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('admin_token')
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [stats, setStats] = useState<DashboardStats>(EMPTY_DASHBOARD_STATS)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [transactions, setTransactions] = useState<AdminTransaction[]>([])
  const [kycDocuments, setKycDocuments] = useState<KycDocument[]>([])
  const [apeSubscriptions, setApeSubscriptions] = useState<ApeSubscription[]>([])
  const [apeStats, setApeStats] = useState<ApeStats>(EMPTY_APE_STATS)
  const [sponsorCodes, setSponsorCodes] = useState<SponsorCode[]>([])
  const [sponsorCodeStats, setSponsorCodeStats] = useState<SponsorCodeStats>(EMPTY_SPONSOR_STATS)
  const [peeLeads, setPeeLeads] = useState<PeeLead[]>([])
  const [peeLeadStats, setPeeLeadStats] = useState<PeeLeadStats>(EMPTY_PEE_STATS)
  const [dashboardCards, setDashboardCards] = useState<DashboardCardConfig[]>([])

  const authedFetch = useCallback(
    async (input: string, init: RequestInit = {}) => {
      const token = getToken()
      if (!token) {
        router.push('/admin/login')
        throw new Error('Not authenticated')
      }
      const res = await fetch(input, {
        ...init,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...(init.headers ?? {}),
        },
      })
      if (res.status === 401) {
        router.push('/admin/login')
      }
      return res
    },
    [router],
  )

  const refresh = useCallback(async () => {
    const token = getToken()
    if (!token) {
      router.push('/admin/login')
      return
    }
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    try {
      setLoading(true)
      setError(null)

      const [usersRes, txRes, kycRes, apeRes, sponsorRes, peeRes, cardsRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/transactions', { headers }),
        fetch('/api/admin/kyc', { headers }),
        fetch('/api/admin/ape-subscriptions', { headers }),
        fetch('/api/admin/sponsor-codes', { headers }),
        fetch('/api/admin/pee-leads', { headers }),
        fetch('/api/admin/dashboard-config', { headers }),
      ])

      if ([usersRes, txRes, kycRes, apeRes, sponsorRes, peeRes, cardsRes].some((r) => r.status === 401)) {
        router.push('/admin/login')
        return
      }

      const nextStats: DashboardStats = { ...EMPTY_DASHBOARD_STATS }

      const usersData = await usersRes.json()
      if (usersData.success) {
        const list: AdminUser[] = usersData.users
        setUsers(list)
        nextStats.totalUsers = list.length
        nextStats.pendingKyc = list.filter((u) => u.kycStatus === 'PENDING').length
        nextStats.underReviewKyc = list.filter((u) => u.kycStatus === 'UNDER_REVIEW').length
      }

      const txData = await txRes.json()
      if (txData.success) {
        const list: AdminTransaction[] = txData.transactionIntents
        setTransactions(list)
        nextStats.pendingTransactions = list.filter((t) => t.status === 'PENDING').length
        nextStats.processingTransactions = list.filter((t) => t.status === 'PROCESSING').length
        nextStats.completedTransactions = list.filter((t) => t.status === 'COMPLETED').length
        nextStats.failedTransactions = list.filter((t) => t.status === 'FAILED').length
        nextStats.totalDeposits = list
          .filter((t) => t.intentType === 'DEPOSIT' && t.status === 'COMPLETED')
          .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
        nextStats.totalInvestments = list
          .filter((t) => t.intentType === 'INVESTMENT' && t.status === 'COMPLETED')
          .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
      }

      const kycData = await kycRes.json()
      if (kycData.success) setKycDocuments(kycData.kycDocuments)

      const apeData = await apeRes.json()
      if (apeData.success) {
        setApeSubscriptions(apeData.subscriptions)
        setApeStats(apeData.stats)
      }

      const sponsorData = await sponsorRes.json()
      if (sponsorData.success) {
        setSponsorCodes(sponsorData.codes)
        setSponsorCodeStats(sponsorData.stats)
      }

      const peeData = await peeRes.json()
      if (peeData.success) {
        setPeeLeads(peeData.leads)
        setPeeLeadStats(peeData.stats)
      }

      const cardsData = await cardsRes.json()
      if (cardsData.success) {
        setDashboardCards(cardsData.cards)
      }

      setStats(nextStats)
    } catch (err) {
      console.error('Error fetching admin data:', err)
      setError('Impossible de charger les données. Réessayez.')
    } finally {
      setLoading(false)
    }
  }, [router])

  const refreshDashboardCards = useCallback(async () => {
    const token = getToken()
    if (!token) {
      router.push('/admin/login')
      return
    }
    try {
      const res = await fetch('/api/admin/dashboard-config', {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      if (data.success) setDashboardCards(data.cards)
    } catch (err) {
      console.error('Error refreshing dashboard cards:', err)
    }
  }, [router])

  const didInit = useRef(false)
  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    const token = getToken()
    if (!token) {
      router.push('/admin/login')
      return
    }
    setAuthenticated(true)
    void refresh()
  }, [router, refresh])

  const value = useMemo<AdminDataContextValue>(
    () => ({
      authenticated,
      loading,
      error,
      stats,
      users,
      transactions,
      kycDocuments,
      apeSubscriptions,
      apeStats,
      sponsorCodes,
      sponsorCodeStats,
      peeLeads,
      peeLeadStats,
      dashboardCards,
      refresh,
      refreshDashboardCards,
      authedFetch,
    }),
    [
      authenticated,
      loading,
      error,
      stats,
      users,
      transactions,
      kycDocuments,
      apeSubscriptions,
      apeStats,
      sponsorCodes,
      sponsorCodeStats,
      peeLeads,
      peeLeadStats,
      dashboardCards,
      refresh,
      refreshDashboardCards,
      authedFetch,
    ],
  )

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}
