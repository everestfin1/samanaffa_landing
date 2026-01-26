import { useQuery, keepPreviousData } from '@tanstack/react-query';

export interface KycParams {
  page?: number;
  pageSize?: number;
}

export interface KycDocument {
  id: string;
  userId: string;
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

  const response = await fetch(`/api/admin/kyc?${searchParams.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch KYC documents');
  }

  return response.json();
};

export const useKycDocuments = (params: KycParams = {}) => {
  return useQuery({
    queryKey: ['admin', 'kyc', params],
    queryFn: () => fetchKycDocuments(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};
