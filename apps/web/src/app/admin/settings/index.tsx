import { createFileRoute } from '@tanstack/react-router';
import PageHeader from '../../../components/admin/layout/PageHeader';
import PageContainer from '../../../components/admin/layout/PageContainer';
import { requireAdminAuth } from '../../../components/admin/hooks/useAdminAuth';
import { Settings, Shield, User, Bell, Palette } from 'lucide-react';

export const Route = createFileRoute('/admin/settings/')({
  beforeLoad: requireAdminAuth,
  component: SettingsPage,
})

function SettingsPage() {
  const sections = [
    { title: 'Profil', description: 'Gérez vos informations personnelles', icon: User },
    { title: 'Sécurité', description: 'Paramètres de mot de passe et 2FA', icon: Shield },
    { title: 'Notifications', description: 'Préférences d\'alerte admin', icon: Bell },
    { title: 'Apparence', description: 'Personnalisation de l\'interface', icon: Palette },
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="Paramètres" 
        description="Configurez votre espace d'administration"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                <section.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[15px] font-black text-slate-900">{section.title}</h3>
                <p className="text-[13px] font-bold text-slate-400 mt-0.5">{section.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}
