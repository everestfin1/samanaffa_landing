import { useQuery } from '@tanstack/react-query';

// Placeholder function
const fetchSponsorCodes = async () => {
  return [];
};

export const useSponsorCodes = () => {
  return useQuery({ queryKey: ['sponsorCodes'], queryFn: fetchSponsorCodes });
};
