import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../components/admin/layout/PageHeader';
import StatCard from '../../components/admin/data-display/StatCard';
import { useDashboardStats, RecentActivity } from './queries';
import { 
  Users, 
  ArrowLeftRight, 
  Wallet, 
  FileCheck,
  ClipboardCheck,
  CreditCard,
  RefreshCw,
  UserPlus,
  CheckCircle2,
  BadgeCheck,
  Banknote,
  ChevronRight,
  Loader2,
} from 'lucide-react';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

const formatVolume = (amount: number): string => {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}Md FCFA`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M FCFA`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K FCFA`;
  return `${amount.toLocaleString()} FCFA`;
};

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  return `Il y a ${diffDays}j`;
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'user_registration': return { icon: UserPlus, bg: '#F0F9FF', color: '#0284C7' };
    case 'transaction_completed': return { icon: CheckCircle2, bg: '#F2F8F4', color: '#435933' };
    case 'kyc_approved': return { icon: BadgeCheck, bg: '#F2F8F4', color: '#435933' };
    case 'deposit_received': return { icon: Banknote, bg: '#FEF9E7', color: '#C38D1C' };
    default: return { icon: CheckCircle2, bg: '#F2F8F4', color: '#435933' };
  }
};

function AdminDashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useDashboardStats();
  
  const stats = data?.stats;
  const recentActivity = data?.recentActivity || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#435933]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Erreur lors du chargement des données</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité de la plateforme"
      />
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Utilisateurs" 
          value={stats?.users.total.toLocaleString() || '0'} 
          icon={Users}
          color="info"
          trend={{ value: stats?.users.trend || 0, label: stats?.users.trendLabel || 'vs mois dernier' }}
        />
        <StatCard 
          label="Transactions" 
          value={stats?.transactions.total.toLocaleString() || '0'} 
          icon={ArrowLeftRight}
          color="success"
          trend={{ value: stats?.transactions.trend || 0, label: stats?.transactions.trendLabel || 'vs mois dernier' }}
        />
        <StatCard 
          label="Volume total" 
          value={formatVolume(stats?.volume.total || 0)} 
          icon={Wallet}
          color="success"
          trend={{ value: stats?.volume.trend || 0, label: stats?.volume.trendLabel || 'vs mois dernier' }}
        />
        <StatCard 
          label="KYC en attente" 
          value={stats?.pendingKyc.total.toString() || '0'} 
          icon={FileCheck}
          color="warning"
          trend={{ value: stats?.pendingKyc.trend || 0, label: stats?.pendingKyc.trendLabel || 'vs semaine dernière' }}
        />
      </div>

      {/* Quick actions & Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/50 flex flex-col">
          <div className="px-8 py-6 border-b border-slate-100">
            <h2 className="text-[18px] font-bold text-slate-900">
              Activité récente
            </h2>
          </div>
          <div className="divide-y divide-slate-100 flex-1">
            {recentActivity.length === 0 ? (
              <div className="px-8 py-12 text-center text-slate-400">
                Aucune activité récente
              </div>
            ) : recentActivity.slice(0, 4).map((item: RecentActivity, i: number) => {
              const { icon: Icon, bg, color } = getActivityIcon(item.type);
              return (
                <div 
                  key={i} 
                  className="flex items-center gap-5 px-8 py-5 hover:bg-slate-50/80 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 shadow-sm"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[15px] font-black text-slate-900 leading-tight">{item.action}</p>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[12px] font-bold text-slate-400">{formatTimeAgo(item.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                        <Users className="w-3 h-3 text-slate-400" />
                      </div>
                      <p className="text-[13px] font-bold text-slate-500">{item.user}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 opacity-0 group-hover:opacity-100 transition-all duration-300 border border-slate-100">
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#435933]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-8 py-5 bg-slate-50/30 rounded-b-2xl border-t border-slate-100/60">
            <button className="text-[14px] font-black text-[#435933] hover:text-[#30461f] transition-all flex items-center gap-2 group">
              Voir toute l'activité 
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 flex flex-col">
          <div className="px-8 py-6 border-b border-slate-100">
            <h2 className="text-[18px] font-black text-slate-900">
              Actions rapides
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <button 
              className="w-full flex items-center gap-4 px-5 py-5 text-[15px] font-black text-left rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#435933]/5 hover:-translate-y-1 group border-2 border-transparent"
              style={{ backgroundColor: '#F2F8F4', color: '#435933' }}
            >
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:rotate-6 transition-transform">
                <ClipboardCheck className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className="flex-1">Valider les KYC en attente</span>
              <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
            <button 
              className="w-full flex items-center gap-4 px-5 py-5 text-[15px] font-black text-left rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#0284C7]/5 hover:-translate-y-1 group border-2 border-transparent"
              style={{ backgroundColor: '#F0F9FF', color: '#0284C7' }}
            >
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:rotate-6 transition-transform">
                <CreditCard className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className="flex-1">Transactions du jour</span>
              <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
            <button 
              className="w-full flex items-center gap-4 px-5 py-5 text-[15px] font-black text-left rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#C38D1C]/5 hover:-translate-y-1 group border-2 border-transparent"
              style={{ backgroundColor: '#FEF9E7', color: '#C38D1C' }}
            >
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:rotate-6 transition-transform">
                <RefreshCw className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className="flex-1">Réconciliation manuelle</span>
              <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
