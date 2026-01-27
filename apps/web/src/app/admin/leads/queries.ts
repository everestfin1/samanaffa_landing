import { useQuery, keepPreviousData } from '@tanstack/react-query';

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

  const response = await fetch(`/api/admin/abandoned-leads?${searchParams.toString()}`, {
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

  const response = await fetch(`/api/admin/pee-leads?${searchParams.toString()}`, {
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
