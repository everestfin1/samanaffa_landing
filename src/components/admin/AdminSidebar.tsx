'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import {
  getVisibleAdminNavGroups,
  type AdminNavItem,
  type AdminTabId,
} from '@/lib/admin/nav'

interface AdminSidebarProps {
  activeTab: AdminTabId
  onTabChange: (tab: AdminTabId) => void
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  stats?: {
    pendingKyc?: number
    pendingTransactions?: number
    paymentInitiated?: number
  }
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
  collapsed,
  onCollapsedChange,
  stats,
}: AdminSidebarProps) {
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

  const getBadge = (key?: AdminNavItem['badgeKey']) => {
    if (!key || !stats) return undefined
    if (key === 'pendingKyc') return stats.pendingKyc
    if (key === 'pendingTransactions') return stats.pendingTransactions
    if (key === 'paymentInitiated') return stats.paymentInitiated
    return undefined
  }

  return (
    <aside
      className={`admin-sidebar ${collapsed ? 'admin-sidebar-collapsed' : ''}`}
      data-collapsed={collapsed}
    >
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
          type="button"
          onClick={toggleCollapsed}
          className="admin-sidebar-toggle"
          aria-label={collapsed ? 'Déplier le menu' : 'Replier le menu'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="admin-sidebar-nav" aria-label="Navigation admin">
        {getVisibleAdminNavGroups().map((group) => (
          <div key={group.id} className="admin-sidebar-nav-group">
            {!collapsed && (
              <span className="admin-sidebar-nav-group-label">{group.label}</span>
            )}
            <ul className="admin-sidebar-nav-list">
              {group.items.map((item) => {
                const Icon = item.icon
                const active = activeTab === item.id
                const badge = getBadge(item.badgeKey)

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onTabChange(item.id)}
                      className={`admin-sidebar-nav-item ${active ? 'active' : ''}`}
                      title={collapsed ? item.label : undefined}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className="admin-sidebar-nav-icon" />
                      {!collapsed && (
                        <>
                          <span className="admin-sidebar-nav-label">
                            {item.label}
                          </span>
                          {badge !== undefined && badge > 0 && (
                            <span className="admin-sidebar-nav-badge">
                              {badge}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && badge !== undefined && badge > 0 && (
                        <span className="admin-sidebar-nav-badge-dot" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        {!collapsed && (
          <p className="admin-sidebar-footer-text">
            © {new Date().getFullYear()} Everest Finance SGI
          </p>
        )}
      </div>
    </aside>
  )
}
