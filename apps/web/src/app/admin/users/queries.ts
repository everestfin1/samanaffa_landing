import { useQuery } from '@tanstack/react-query';

// Placeholder function
const fetchUsers = async () => {
  return [];
};

export const useUsers = () => {
  return useQuery({ queryKey: ['users'], queryFn: fetchUsers });
};
