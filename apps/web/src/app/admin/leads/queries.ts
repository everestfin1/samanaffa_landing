import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiUrl } from '../../../lib/api-config';

export interface AbandonedLeadsParams {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: string;
  date?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AbandonedLead {
  id: string;
  anonymousId: string;
  formType: string;
  draftData: Record<string, unknown>;
  email: string | null;
  phone: string | null;
  stepReached: string | null;
  fieldsCompleted: number | null;
  totalFields: number | null;
  source: Record<string, unknown> | null;
  deviceInfo: Record<string, unknown> | null;
  score: number;
  status: string;
  adminNotes: string | null;
  firstSeenAt: string;
  lastActivityAt: string;
  convertedAt: string | null;
}

export interface AbandonedLeadsResponse {
  success: boolean;
  drafts: AbandonedLead[];
  stats: {
    total: number;
    abandoned: number;
    contacted: number;
    converted: number;
    dismissed: number;
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface PeeLeadsParams {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: string;
  date?: string;
}

export interface PeeLeadApiItem {
  id: string;
  civilite: string;
  prenom: string;
  nom: string;
  categorie: string;
  pays: string;
  ville: string;
  telephone: string;
  email: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PeeLeadsResponse {
  success: boolean;
  peeLeads: PeeLeadApiItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const fetchAbandonedLeads = async (params: AbandonedLeadsParams): Promise<AbandonedLeadsResponse> => {
  const token = localStorage.getItem('admin_token');
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
  if (params.q) searchParams.set('q', params.q);
  if (params.status) searchParams.set('status', params.status);
  if (params.date) searchParams.set('date', params.date);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const response = await fetch(apiUrl(`/api/admin/abandoned-leads?${searchParams.toString()}`), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch abandoned leads');
  }

  return response.json();
};

export const useAbandonedLeads = (params: AbandonedLeadsParams = {}) => {
  return useQuery({
    queryKey: ['admin', 'abandoned-leads', params],
    queryFn: () => fetchAbandonedLeads(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

const fetchPeeLeads = async (params: PeeLeadsParams): Promise<PeeLeadsResponse> => {
  const token = localStorage.getItem('admin_token');
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
  if (params.q) searchParams.set('q', params.q);
  if (params.status) searchParams.set('status', params.status);
  if (params.date) searchParams.set('date', params.date);

  const response = await fetch(apiUrl(`/api/admin/pee-leads?${searchParams.toString()}`), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch PEE leads');
  }

  return response.json();
};

export const usePeeLeads = (params: PeeLeadsParams = {}) => {
  return useQuery({
    queryKey: ['admin', 'pee-leads', params],
    queryFn: () => fetchPeeLeads(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

export type UpdatePeeLeadInput = {
  id: string;
  status?: string;
  adminNotes?: string | null;
};

export async function updatePeeLead(input: UpdatePeeLeadInput) {
  const token = localStorage.getItem('admin_token');
  const response = await fetch(apiUrl(`/api/admin/pee-leads/${input.id}`), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: input.status,
      adminNotes: input.adminNotes,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update PEE lead');
  }

  return response.json() as Promise<{ success: boolean; peeLead: PeeLeadApiItem }>;
}

export function useUpdatePeeLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePeeLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pee-leads'] });
    },
  });
}

export type UpdateAbandonedLeadInput = {
  id: string;
  status?: string;
  adminNotes?: string | null;
};

export async function updateAbandonedLead(input: UpdateAbandonedLeadInput) {
  const token = localStorage.getItem('admin_token');
  const response = await fetch(apiUrl(`/api/admin/abandoned-leads/${input.id}`), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: input.status,
      adminNotes: input.adminNotes,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update abandoned lead');
  }

  return response.json() as Promise<{ success: boolean; draft: AbandonedLead }>;
}

export function useUpdateAbandonedLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAbandonedLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'abandoned-leads'] });
    },
  });
}
