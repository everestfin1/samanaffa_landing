import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface TransactionIntent {
  id: string;
  userId: string;
  accountType: string;
  intentType: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INVESTMENT';
  amount: number;
  paymentMethod: string;
  status: string;
  referenceNumber: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface TransactionsResponse {
  transactionIntents: TransactionIntent[];
  total: number;
  page: number;
  limit: number;
}

// Query hook for fetching user transactions
export const useUserTransactions = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['userTransactions', page, limit],
    queryFn: async (): Promise<TransactionsResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/transactions/intent?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch transactions');
      }

      return {
        transactionIntents: data.transactionIntents || [],
        total: data.total || 0,
        page,
        limit,
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute - transaction data should be relatively fresh
    gcTime: 5 * 60 * 1000, // 5 minutes (renamed from cacheTime in v5)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for fetching recent transactions (last 5 for dashboard)
export const useRecentTransactions = (userId: string, limit = 5) => {
  return useQuery({
    queryKey: ['recentTransactions', userId, limit],
    queryFn: async (): Promise<TransactionIntent[]> => {
      if (!userId) {
        return []; // Return empty array instead of throwing
      }

      const response = await fetch(`/api/transactions/intent?userId=${userId}&limit=${limit * 2}`);

      if (!response.ok) {
        throw new Error('Failed to fetch recent transactions');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch recent transactions');
      }

      // Sort by createdAt desc and limit on client side
      const sortedTransactions = (data.transactionIntents || [])
        .sort((a: TransactionIntent, b: TransactionIntent) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, limit);

      return sortedTransactions;
    },
    staleTime: 30 * 1000, // 30 seconds - very fresh for recent activity
    gcTime: 2 * 60 * 1000, // 2 minutes garbage collection
    retry: 2,
    enabled: !!userId, // Only run if userId is provided
  });
};

// Hook for fetching transactions by account type
export const useTransactionsByAccountType = (accountType: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['transactionsByAccountType', accountType, page, limit],
    queryFn: async (): Promise<TransactionsResponse> => {
      const params = new URLSearchParams({
        accountType,
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/transactions/intent?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch transactions by account type');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch transactions by account type');
      }

      return {
        transactionIntents: data.transactionIntents || [],
        total: data.total || 0,
        page,
        limit,
      };
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    enabled: !!accountType, // Only run if accountType is provided
  });
};

// Mutation hook for creating a transaction intent
export const useCreateTransactionIntent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionData: {
      accountType: string;
      intentType: string;
      type: 'DEPOSIT' | 'WITHDRAWAL' | 'INVESTMENT';
      amount: number;
      paymentMethod: string;
      accountId?: string;
    }): Promise<TransactionIntent> => {
      const response = await fetch('/api/transactions/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error('Failed to create transaction intent');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create transaction intent');
      }

      return data.transactionIntent;
    },
    onSuccess: () => {
      // Invalidate and refetch transactions
      queryClient.invalidateQueries({ queryKey: ['userTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['recentTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactionsByAccountType'] });

      // Also invalidate accounts since balances might change
      queryClient.invalidateQueries({ queryKey: ['userAccounts'] });
      queryClient.invalidateQueries({ queryKey: ['allUserAccounts'] });
    },
    onError: (error) => {
      console.error('Transaction creation failed:', error);
    },
  });
};

// Hook for invalidating transactions cache
export const useInvalidateTransactions = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['userTransactions'] });
    queryClient.invalidateQueries({ queryKey: ['recentTransactions'] });
    queryClient.invalidateQueries({ queryKey: ['transactionsByAccountType'] });
  };
};

// Prefetch hook for improving navigation performance
export const usePrefetchTransactions = () => {
  const queryClient = useQueryClient();

  return {
    prefetchUserProfile: () =>
      queryClient.prefetchQuery({
        queryKey: ['userProfile'],
        staleTime: 5 * 60 * 1000,
      }),

    prefetchRecentTransactions: (userId: string, limit = 5) =>
      queryClient.prefetchQuery({
        queryKey: ['recentTransactions', userId, limit],
        staleTime: 30 * 1000,
      }),

    prefetchAccountTransactions: (accountType: string, page = 1, limit = 20) =>
      queryClient.prefetchQuery({
        queryKey: ['transactionsByAccountType', accountType, page, limit],
        staleTime: 1 * 60 * 1000,
      }),
  };
};
