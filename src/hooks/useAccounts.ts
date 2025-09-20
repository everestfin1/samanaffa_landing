import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UserAccount {
  id: string;
  userId: string;
  accountType: string;
  accountNumber: string;
  balance: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface AccountsResponse {
  accounts: UserAccount[];
  total: number;
  page: number;
  limit: number;
}

// Query hook for fetching user accounts
export const useUserAccounts = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['userAccounts', page, limit],
    queryFn: async (): Promise<AccountsResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/accounts?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user accounts');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch user accounts');
      }

      return {
        accounts: data.accounts || [],
        total: data.total || 0,
        page,
        limit,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - accounts data changes more frequently
    gcTime: 5 * 60 * 1000, // 5 minutes (renamed from cacheTime in v5)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for getting all accounts (non-paginated, for calculations)
export const useAllUserAccounts = () => {
  return useQuery({
    queryKey: ['allUserAccounts'],
    queryFn: async (): Promise<UserAccount[]> => {
      const response = await fetch('/api/accounts?limit=1000'); // Get all accounts

      if (!response.ok) {
        throw new Error('Failed to fetch user accounts');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch user accounts');
      }

      return data.accounts || [];
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000, // 5 minutes (renamed from cacheTime in v5)
    retry: 3,
  });
};

// Mutation hook for creating a new account
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountData: {
      accountType: string;
      initialDeposit?: number;
    }): Promise<UserAccount> => {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create account');
      }

      return data.account;
    },
    onSuccess: () => {
      // Invalidate and refetch accounts
      queryClient.invalidateQueries({ queryKey: ['userAccounts'] });
      queryClient.invalidateQueries({ queryKey: ['allUserAccounts'] });
    },
    onError: (error) => {
      console.error('Account creation failed:', error);
    },
  });
};

// Hook for invalidating accounts cache
export const useInvalidateAccounts = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['userAccounts'] });
    queryClient.invalidateQueries({ queryKey: ['allUserAccounts'] });
  };
};
