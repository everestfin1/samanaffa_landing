import * as React from 'react';
import { Search, Bell, User, ChevronDown, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

const AdminHeader = () => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
    (navigate as any)({ to: '/admin/login' });
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200/60 px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 group-focus-within:text-[#435933] transition-colors" />
          <input
            type="text"
            placeholder="Rechercher utilisateurs, transactions, KYC..."
            className="w-full pl-12 pr-4 py-2.5 text-[14px] font-medium bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#435933]/5 focus:border-[#435933] focus:bg-white transition-all placeholder:text-slate-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-sans text-[10px] font-medium text-slate-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative p-2.5 rounded-2xl transition-all duration-200 ${
              isNotificationsOpen ? 'bg-[#C38D1C]/10 text-[#C38D1C]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-[22px] h-[22px]" strokeWidth={1.5} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse" style={{ backgroundColor: '#C38D1C' }} />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-2 border-b border-slate-50 mb-2">
                <h3 className="font-bold text-slate-900">Notifications</h3>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <button key={i} className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-900">Nouvel utilisateur</p>
                      <p className="text-[11px] text-slate-500">Aliou Wade vient de s'inscrire</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-50 mt-2">
                <button className="text-[12px] font-bold text-[#435933] hover:underline">Voir tout</button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-slate-200/60 mx-1" />

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`flex items-center gap-3 p-1 rounded-2xl transition-all duration-200 border-2 ${
              isUserMenuOpen ? 'border-[#435933] bg-[#435933]/5' : 'border-transparent hover:bg-slate-50'
            }`}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[13px] font-black shadow-lg shadow-black/10" style={{ backgroundColor: '#243318' }}>
              AD
            </div>
            <div className="text-left hidden lg:block pr-2">
              <p className="text-[13px] font-black text-slate-900 leading-tight">Administrateur</p>
              <p className="text-[10px] font-bold text-[#C38D1C] uppercase tracking-wider mt-0.5">Super Admin</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 mr-1 ${isUserMenuOpen ? 'rotate-180 text-[#435933]' : ''}`} />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                <p className="text-[13px] font-black text-slate-900">Administrateur</p>
                <p className="text-[11px] font-medium text-slate-500">admin@samanaffa.sn</p>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <User className="w-4 h-4" />
                  <span>Mon Profil</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Paramètres</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  <span>Aide</span>
                </button>
              </div>
              <div className="p-2 border-t border-slate-100 bg-red-50/30">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-black text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
