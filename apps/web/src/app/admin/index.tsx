import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '../../components/admin/layout/PageHeader';
import StatCard from '../../components/admin/data-display/StatCard';
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
} from 'lucide-react';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

function AdminDashboard() {
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
          value="1,234" 
          icon={Users}
          color="info"
          trend={{ value: 12, label: 'vs mois dernier' }}
        />
        <StatCard 
          label="Transactions" 
          value="5,678" 
          icon={ArrowLeftRight}
          color="success"
          trend={{ value: 8, label: 'vs mois dernier' }}
        />
        <StatCard 
          label="Volume total" 
          value="125M FCFA" 
          icon={Wallet}
          color="success"
          trend={{ value: 15, label: 'vs mois dernier' }}
        />
        <StatCard 
          label="KYC en attente" 
          value="23" 
          icon={FileCheck}
          color="warning"
          trend={{ value: -5, label: 'vs semaine dernière' }}
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
            {[
              { action: 'Nouvelle inscription', user: 'Aliou W.', time: 'Il y a 5 min', icon: UserPlus, bg: '#F0F9FF', iconColor: '#0284C7', type: 'user' },
              { action: 'Transaction validée', user: 'Astou N.', time: 'Il y a 12 min', icon: CheckCircle2, bg: '#F2F8F4', iconColor: '#435933', type: 'success' },
              { action: 'KYC approuvé', user: 'Moussa D.', time: 'Il y a 23 min', icon: BadgeCheck, bg: '#F2F8F4', iconColor: '#435933', type: 'success' },
              { action: 'Dépôt reçu', user: 'Fatou S.', time: 'Il y a 45 min', icon: Banknote, bg: '#FEF9E7', iconColor: '#C38D1C', type: 'warning' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex items-center gap-5 px-8 py-5 hover:bg-slate-50/80 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 shadow-sm"
                  style={{ backgroundColor: item.bg }}
                >
                  <item.icon className="w-5 h-5" style={{ color: item.iconColor }} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-black text-slate-900 leading-tight">{item.action}</p>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[12px] font-bold text-slate-400">{item.time}</span>
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
            ))}
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
