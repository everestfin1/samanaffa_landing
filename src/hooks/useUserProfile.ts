import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  nationality?: string;
  address?: string;
  city?: string;
  preferredLanguage?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: string;
  createdAt: string;
  accounts: Array<{
    id: string;
    accountType: string;
    accountNumber: string;
    balance: number;
    status: string;
  }>;
  kycDocuments: Array<{
    id: string;
    documentType: string;
    fileUrl: string;
    fileName: string;
    uploadDate: string;
    verificationStatus: string;
    adminNotes?: string;
  }>;
}

// Query hook for fetching user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async (): Promise<UserProfile> => {
      const response = await fetch('/api/users/profile');

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch user profile');
      }

      return data.user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Enable background refetch for critical user data
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes in background
    refetchIntervalInBackground: true, // Allow refetching even when tab is not active
  });
};

// Mutation hook for updating user profile
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update user profile');
      }

      return data.user;
    },
    onSuccess: (updatedUser) => {
      // Update the cached user profile data
      queryClient.setQueryData(['userProfile'], updatedUser);

      // Optionally invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
    },
  });
};

// Hook for invalidating user profile (useful after file uploads, etc.)
export const useInvalidateUserProfile = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
  };
};
