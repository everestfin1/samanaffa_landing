import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiUrl } from '../../../lib/api-config';

export interface KycParams {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: string;
  date?: string;
}

export interface KycDocument {
  id: string;
  userId: string;
  userName?: string;
  userGroupKey?: string;
  documentType: string;
  fileUrl: string;
  fileName: string;
  uploadDate: string;
  verificationStatus: string;
  adminNotes: string | null;
}

export interface KycResponse {
  success: boolean;
  kycDocuments: KycDocument[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const fetchKycDocuments = async (params: KycParams): Promise<KycResponse> => {
  const token = localStorage.getItem('admin_token');
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
  if (params.q) searchParams.set('q', params.q);
  if (params.status) searchParams.set('status', params.status);
  if (params.date) searchParams.set('date', params.date);

  const response = await fetch(apiUrl(`/api/admin/kyc?${searchParams.toString()}`), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch KYC documents');
  }

  const json = (await response.json()) as KycResponse;
  const kycDocuments = (json.kycDocuments ?? []).map((d) => {
    const name = (d.userName ?? '').trim();
    const id = d.userId;
    const key = `${name}__${id}`;
    return {
      ...d,
      userGroupKey: key,
    };
  });

  return {
    ...json,
    kycDocuments,
  };
};

export const useKycDocuments = (params: KycParams = {}) => {
  return useQuery({
    queryKey: ['admin', 'kyc', params],
    queryFn: () => fetchKycDocuments(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};
