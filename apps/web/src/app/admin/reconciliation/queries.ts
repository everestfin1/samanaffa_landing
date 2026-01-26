import { useQuery } from '@tanstack/react-query';

// Placeholder function
const fetchReconciliationData = async () => {
  return [];
};

export const useReconciliationData = () => {
  return useQuery({ queryKey: ['reconciliation'], queryFn: fetchReconciliationData });
};
