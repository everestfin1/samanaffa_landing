import { keepPreviousData, useQuery } from '@tanstack/react-query'

export interface SponsorCodesParams {
  page?: number
  pageSize?: number
  q?: string
  status?: string
  date?: string
}

export interface SponsorCode {
  id: string
  code: string
  usageCount: number
  maxUsage: number | null
  status: string
  createdAt: string
  updatedAt: string
  description?: string | null
  expiresAt?: string | null
}

export interface SponsorCodesResponse {
  success: boolean
  sponsorCodes: SponsorCode[]
  stats: {
    total: number
    active: number
    inactive: number
    expired: number
    totalUsage: number
  }
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

const fetchSponsorCodes = async (params: SponsorCodesParams): Promise<SponsorCodesResponse> => {
  const token = localStorage.getItem('admin_token')
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.q) searchParams.set('q', params.q)
  if (params.status) searchParams.set('status', params.status)
  if (params.date) searchParams.set('date', params.date)

  const response = await fetch(`/api/admin/sponsor-codes?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch sponsor codes')
  }

  return response.json()
}

export const useSponsorCodes = (params: SponsorCodesParams = {}) => {
  return useQuery({
    queryKey: ['admin', 'sponsor-codes', params],
    queryFn: () => fetchSponsorCodes(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}
