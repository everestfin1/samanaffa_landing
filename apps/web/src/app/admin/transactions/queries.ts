import { useQuery } from '@tanstack/react-query';

// Placeholder function
const fetchTransactions = async () => {
  return [];
};

export const useTransactions = () => {
  return useQuery({ queryKey: ['transactions'], queryFn: fetchTransactions });
};
