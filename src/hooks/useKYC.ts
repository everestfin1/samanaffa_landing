import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface KYCDocument {
  id: string;
  userId: string;
  documentType: string;
  fileUrl: string;
  fileName: string;
  uploadDate: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface KYCStatus {
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  documents: KYCDocument[];
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

// Query hook for fetching KYC documents
export const useKYCDocuments = () => {
  return useQuery({
    queryKey: ['kycDocuments'],
    queryFn: async (): Promise<KYCDocument[]> => {
      const response = await fetch('/api/kyc/documents');

      if (!response.ok) {
        throw new Error('Failed to fetch KYC documents');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch KYC documents');
      }

      return data.documents || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - KYC status can change
    gcTime: 5 * 60 * 1000, // 5 minutes (renamed from cacheTime in v5)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Query hook for fetching KYC status
export const useKYCStatus = () => {
  return useQuery({
    queryKey: ['kycStatus'],
    queryFn: async (): Promise<KYCStatus> => {
      const response = await fetch('/api/kyc/status');

      if (!response.ok) {
        throw new Error('Failed to fetch KYC status');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch KYC status');
      }

      return data.kycStatus;
    },
    staleTime: 1 * 60 * 1000, // 1 minute - KYC status is important
    gcTime: 5 * 60 * 1000, // 5 minutes (renamed from cacheTime in v5)
    retry: 3,
  });
};

// Mutation hook for uploading KYC documents
export const useUploadKYCDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uploadData: {
      file: File;
      documentType: string;
    }): Promise<KYCDocument> => {
      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('documentType', uploadData.documentType);

      const response = await fetch('/api/kyc/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload KYC document');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to upload KYC document');
      }

      return data.document;
    },
    onSuccess: () => {
      // Invalidate KYC-related queries
      queryClient.invalidateQueries({ queryKey: ['kycDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['kycStatus'] });

      // Also invalidate user profile since KYC status might affect it
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      console.error('KYC document upload failed:', error);
    },
  });
};

// Mutation hook for submitting KYC for review
export const useSubmitKYCForReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<KYCStatus> => {
      const response = await fetch('/api/kyc/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to submit KYC for review');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit KYC for review');
      }

      return data.kycStatus;
    },
    onSuccess: () => {
      // Invalidate KYC-related queries
      queryClient.invalidateQueries({ queryKey: ['kycDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['kycStatus'] });

      // Also invalidate user profile since KYC status will change
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      console.error('KYC submission failed:', error);
    },
  });
};

// Hook for invalidating KYC cache
export const useInvalidateKYC = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['kycDocuments'] });
    queryClient.invalidateQueries({ queryKey: ['kycStatus'] });
  };
};
