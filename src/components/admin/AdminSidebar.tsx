'use client'

import Image from 'next/image'
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  FileSpreadsheet,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Gift,
  GraduationCap,
  RefreshCw,
  Archive
} from 'lucide-react'
import { useEffect } from 'react'

type TabId = 'overview' | 'users' | 'transactions' | 'kyc' | 'apeSubscriptions' | 'reconciliation' | 'sponsorCodes' | 'peeLeads' | 'abandonedLeads' | 'notifications' | 'settings'

interface NavItem {
  id: TabId
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface AdminSidebarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  stats?: {
    pendingKyc?: number
    pendingTransactions?: number
    paymentInitiated?: number
  }
}

export default function AdminSidebar({ activeTab, onTabChange, collapsed, onCollapsedChange, stats }: AdminSidebarProps) {
  // Persist collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('admin_sidebar_collapsed')
    if (saved) onCollapsedChange(saved === 'true')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleCollapsed = () => {
    const newState = !collapsed
    onCollapsedChange(newState)
    localStorage.setItem('admin_sidebar_collapsed', String(newState))
  }

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: CreditCard, badge: stats?.pendingTransactions },
    { id: 'apeSubscriptions', label: 'APE Sénégal', icon: FileSpreadsheet, badge: stats?.paymentInitiated },
    { id: 'reconciliation', label: 'Réconciliation', icon: RefreshCw },
    { id: 'sponsorCodes', label: 'Codes Parrainage', icon: Gift },
    { id: 'peeLeads', label: 'PEE Leads', icon: GraduationCap },
    { id: 'abandonedLeads', label: 'Leads abandonnés', icon: Archive },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'kyc', label: 'KYC', icon: FileText, badge: stats?.pendingKyc },
    { id: 'notifications', label: 'Notifications', icon: MessageSquare },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ]

  return (
    <aside 
      className={`admin-sidebar ${collapsed ? 'admin-sidebar-collapsed' : ''}`}
      data-collapsed={collapsed}
    >
      {/* Logo */}
      <div className="admin-sidebar-header">
        <button 
          onClick={() => onTabChange('overview')} 
          className="admin-sidebar-logo"
          type="button"
        >
          <div className="admin-sidebar-logo-icon">
            <Image
              src="/sama_naffa_logo.png"
              alt="Sama Naffa"
              width={collapsed ? 36 : 40}
              height={collapsed ? 36 : 40}
              className="h-9 w-9 object-contain"
              priority
            />
          </div>
          {!collapsed && (
            <div className="admin-sidebar-logo-text">
              <span className="admin-sidebar-logo-title">Sama Naffa</span>
              <span className="admin-sidebar-logo-badge">Administration</span>
            </div>
          )}
        </button>
        <button 
          onClick={toggleCollapsed}
          className="admin-sidebar-toggle"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav">
        <ul className="admin-sidebar-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = activeTab === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`admin-sidebar-nav-item ${active ? 'active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="admin-sidebar-nav-icon" />
                  {!collapsed && (
                    <>
                      <span className="admin-sidebar-nav-label">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="admin-sidebar-nav-badge">{item.badge}</span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className="admin-sidebar-nav-badge-dot" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-footer">
        {!collapsed && (
          <p className="admin-sidebar-footer-text">
            © {new Date().getFullYear()} Everest Finance
          </p>
        )}
      </div>
    </aside>
  )
}
