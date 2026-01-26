import { useQuery } from '@tanstack/react-query';

// Placeholder function
const fetchApeSubscriptions = async () => {
  return [];
};

export const useApeSubscriptions = () => {
  return useQuery({ queryKey: ['apeSubscriptions'], queryFn: fetchApeSubscriptions });
};
