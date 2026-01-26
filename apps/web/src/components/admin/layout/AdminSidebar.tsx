import * as React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  LayoutDashboard,
  ArrowLeftRight,
  RefreshCcw,
  Users,
  FileCheck,
  Landmark,
  GraduationCap,
  Target,
  Tag,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Opérations',
    items: [
      { name: 'Tableau de bord', path: '/admin', icon: LayoutDashboard },
      { name: 'Transactions', path: '/admin/transactions', icon: ArrowLeftRight },
      { name: 'Réconciliation', path: '/admin/reconciliation', icon: RefreshCcw },
    ],
  },
  {
    title: 'Clients',
    items: [
      { name: 'Utilisateurs', path: '/admin/users', icon: Users },
      { name: 'Documents KYC', path: '/admin/kyc', icon: FileCheck },
    ],
  },
  {
    title: 'Programmes',
    items: [
      { name: 'APE Sénégal', path: '/admin/ape-subscriptions', icon: Landmark },
      { name: 'Leads PEE', path: '/admin/leads/pee', icon: GraduationCap },
    ],
  },
  {
    title: 'Croissance',
    items: [
      { name: 'Leads abandonnés', path: '/admin/leads/abandoned', icon: Target },
      { name: 'Codes parrain', path: '/admin/sponsor-codes', icon: Tag },
    ],
  },
  {
    title: 'Système',
    items: [
      { name: 'Notifications', path: '/admin/notifications', icon: Bell },
      { name: 'Paramètres', path: '/admin/settings', icon: Settings },
    ],
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('admin_sidebar_collapsed');
    if (saved) {
      setCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('admin_sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleLogout = () => {
    // Implement actual logout logic here
    console.log('Logging out...');
    (navigate as any)({ to: '/admin/login' });
  };

  return (
    <aside
      className={`${collapsed ? 'w-[88px]' : 'w-72'} flex-shrink-0 flex flex-col border-r border-white/5 transition-[width] duration-200`}
      style={{ background: '#243318' }}
    >
      {/* Logo */}
      <div className={`h-20 flex items-center ${collapsed ? 'justify-center px-4' : 'gap-3 px-6'}`}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transform rotate-3" style={{ backgroundColor: '#C38D1C' }}>
          <span className="text-white font-black text-xl">S</span>
        </div>
        {!collapsed && (
          <div>
            <span className="text-lg font-black tracking-tight text-white leading-none block">Sama Naffa</span>
            <p className="text-[9px] text-white/40 uppercase tracking-[0.15em] font-semibold mt-0.5">Admin</p>
          </div>
        )}
        <button
          type="button"
          onClick={toggleCollapsed}
          className={`ml-auto ${collapsed ? 'ml-0' : ''} p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors duration-200`}
          aria-label={collapsed ? 'Ouvrir la navigation' : 'Réduire la navigation'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto py-6 ${collapsed ? 'px-3' : 'px-4'} space-y-5 custom-scrollbar`}>
        {navGroups.map((group) => (
          <div key={group.title}>
            {!collapsed ? (
              <div className="px-3 mb-3 flex items-center gap-3">
                <span className="text-[8px] font-semibold text-white/30 uppercase tracking-[0.16em]">
                  {group.title}
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
            ) : (
              <div className="mb-3 flex items-center justify-center">
                <span className="h-px w-10 bg-white/10" />
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center ${collapsed ? 'justify-center px-2.5' : 'gap-3 px-3'} py-2.5 rounded-lg text-[13px] font-medium text-white/60 hover:bg-white/8 hover:text-white transition-all duration-200 group relative overflow-hidden`}
                    activeOptions={{ exact: true }}
                    activeProps={{
                      className: `flex items-center ${collapsed ? 'justify-center px-2.5' : 'gap-3 px-3'} py-2.5 rounded-lg text-[13px] font-medium text-white bg-white/12 shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)]`,
                    }}
                  >
                    <item.icon className="w-4.5 h-4.5 flex-shrink-0 opacity-60 group-hover:opacity-90 transition-opacity duration-200" strokeWidth={2.2} />
                    {!collapsed && <span className="relative z-10">{item.name}</span>}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.01] to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className={`mt-auto border-t border-white/5 ${collapsed ? 'p-3' : 'p-4'}`}>
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center ${collapsed ? 'justify-center px-2.5' : 'gap-3 px-3'} py-3 rounded-lg text-[13px] font-medium text-red-400/75 hover:bg-red-500/12 hover:text-red-300 transition-all duration-200 group`}
        >
          <LogOut className="w-4.5 h-4.5 opacity-70 group-hover:opacity-100 transition-opacity duration-200" strokeWidth={2.2} />
          {!collapsed && <span>Déconnexion</span>}
        </button>
        {!collapsed && (
          <div className="mt-4 px-3">
            <p className="text-[8px] text-white/20 font-semibold tracking-widest uppercase">© 2026 Everest Finance</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
