import { useQuery } from '@tanstack/react-query';

// Placeholder function
const fetchKycDocuments = async () => {
  return [];
};

export const useKycDocuments = () => {
  return useQuery({ queryKey: ['kycDocuments'], queryFn: fetchKycDocuments });
};
