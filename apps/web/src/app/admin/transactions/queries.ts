import { useQuery, keepPreviousData } from '@tanstack/react-query';

export interface TransactionsParams {
  page?: number;
  pageSize?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  accountType: string;
  intentType: string;
  amount: string;
  paymentMethod: string;
  status: string;
  referenceNumber: string;
  providerTransactionId: string | null;
  providerStatus: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsResponse {
  success: boolean;
  transactions: Transaction[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const fetchTransactions = async (params: TransactionsParams): Promise<TransactionsResponse> => {
  const token = localStorage.getItem('admin_token');
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));

  const response = await fetch(`/api/admin/transactions?${searchParams.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  return response.json();
};

export const useTransactions = (params: TransactionsParams = {}) => {
  return useQuery({
    queryKey: ['admin', 'transactions', params],
    queryFn: () => fetchTransactions(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};
