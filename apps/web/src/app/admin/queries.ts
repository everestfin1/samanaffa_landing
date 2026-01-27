import { useQuery } from '@tanstack/react-query';

export interface DashboardStats {
  users: {
    total: number;
    trend: number;
    trendLabel: string;
  };
  transactions: {
    total: number;
    trend: number;
    trendLabel: string;
  };
  volume: {
    total: number;
    trend: number;
    trendLabel: string;
  };
  pendingKyc: {
    total: number;
    trend: number;
    trendLabel: string;
  };
}

export interface RecentActivity {
  type: string;
  action: string;
  user: string;
  amount?: string;
  timestamp: string;
}

export interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  recentActivity: RecentActivity[];
}

const fetchDashboardStats = async (): Promise<DashboardResponse> => {
  const token = localStorage.getItem('admin_token');
  
  const response = await fetch('/api/admin/dashboard/stats', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }

  return response.json();
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: fetchDashboardStats,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
};
