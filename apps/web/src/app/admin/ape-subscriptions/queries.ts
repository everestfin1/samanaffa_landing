import { keepPreviousData, useQuery } from '@tanstack/react-query'

export interface ApeSubscriptionsParams {
  page?: number
  pageSize?: number
  q?: string
  status?: string
  date?: string
}

export interface ApeSubscriptionApiItem {
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
  codeParrainage: string | null
  status: string
  providerTransactionId: string | null
  providerStatus: string | null
  paymentCallbackPayload: unknown
  paymentInitiatedAt: string | null
  paymentCompletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ApeSubscriptionsResponse {
  success: boolean
  subscriptions: ApeSubscriptionApiItem[]
  stats: {
    total: number
    pending: number
    payment_initiated: number
    payment_success: number
    payment_failed: number
    cancelled: number
    totalVolume: number
  }
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

const fetchApeSubscriptions = async (params: ApeSubscriptionsParams): Promise<ApeSubscriptionsResponse> => {
  const token = localStorage.getItem('admin_token')
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.q) searchParams.set('q', params.q)
  if (params.status) searchParams.set('status', params.status)
  if (params.date) searchParams.set('date', params.date)

  const response = await fetch(`/api/admin/ape-subscriptions?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch APE subscriptions')
  }

  return response.json()
}

export const useApeSubscriptions = (params: ApeSubscriptionsParams = {}) => {
  return useQuery({
    queryKey: ['admin', 'ape-subscriptions', params],
    queryFn: () => fetchApeSubscriptions(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}
