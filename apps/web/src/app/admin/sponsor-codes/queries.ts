import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiUrl } from '../../../lib/api-config'

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

  const response = await fetch(apiUrl(`/api/admin/sponsor-codes?${searchParams.toString()}`), {
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

export type CreateSponsorCodeInput = {
  code?: string
  description?: string | null
  maxUsage?: number | null
  expiresAt?: string | null
}

export async function createSponsorCode(input: CreateSponsorCodeInput) {
  const token = localStorage.getItem('admin_token')

  const response = await fetch(apiUrl('/api/admin/sponsor-codes'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error('Failed to create sponsor code')
  }

  return response.json() as Promise<{ success: boolean; sponsorCode: SponsorCode }>
}

export type UpdateSponsorCodeInput = {
  id: string
  status?: string
  description?: string | null
  maxUsage?: number | null
  expiresAt?: string | null
}

export async function updateSponsorCode(input: UpdateSponsorCodeInput) {
  const token = localStorage.getItem('admin_token')

  const response = await fetch(apiUrl(`/api/admin/sponsor-codes/${input.id}`), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: input.status,
      description: input.description,
      maxUsage: input.maxUsage,
      expiresAt: input.expiresAt,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to update sponsor code')
  }

  return response.json() as Promise<{ success: boolean; sponsorCode: SponsorCode }>
}

export function useCreateSponsorCode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSponsorCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sponsor-codes'] })
    },
  })
}

export function useUpdateSponsorCode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSponsorCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sponsor-codes'] })
    },
  })
}
