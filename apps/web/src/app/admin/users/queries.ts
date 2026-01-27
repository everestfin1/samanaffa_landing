import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiUrl } from '../../../lib/api-config';

export interface UsersParams {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: string;
  date?: string;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  nationality: string | null;
  address: string | null;
  city: string | null;
  preferredLanguage: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: string;
  createdAt: string;
  updatedAt: string;
  civilite: string | null;
  country: string | null;
  region: string | null;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const fetchUsers = async (params: UsersParams): Promise<UsersResponse> => {
  const token = localStorage.getItem('admin_token');
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
  if (params.q) searchParams.set('q', params.q);
  if (params.status) searchParams.set('status', params.status);
  if (params.date) searchParams.set('date', params.date);

  const response = await fetch(apiUrl(`/api/admin/users?${searchParams.toString()}`), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

export const useUsers = (params: UsersParams = {}) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => fetchUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};
