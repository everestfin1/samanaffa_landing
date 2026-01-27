import { createFileRoute } from '@tanstack/react-router';
import PageHeader from '../../../components/admin/layout/PageHeader';
import PageContainer from '../../../components/admin/layout/PageContainer';
import { requireAdminAuth } from '../../../components/admin/hooks/useAdminAuth';
import { Bell } from 'lucide-react';

export const Route = createFileRoute('/admin/notifications/')({
  beforeLoad: requireAdminAuth,
  component: NotificationsPage,
})

function NotificationsPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Notifications" 
        description="Gérez les alertes et les communications système"
      />
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
          <Bell className="w-10 h-10" strokeWidth={1.5} />
        </div>
        <div className="max-w-xs">
          <h3 className="text-[16px] font-black text-slate-900">Aucune notification</h3>
          <p className="text-[13px] font-bold text-slate-400 mt-1">
            Le centre de notifications sera bientôt disponible pour gérer vos alertes en temps réel.
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
