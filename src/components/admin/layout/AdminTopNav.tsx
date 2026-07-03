'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, RefreshCw, LogOut } from 'lucide-react'
import {
  getVisibleAdminNavGroups,
  tabIdFromPath,
  type AdminNavGroup,
  type AdminNavItem,
} from '@/lib/admin/nav'
import { useAdminData } from '@/lib/admin/AdminDataProvider'

export default function AdminTopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { stats, apeStats, loading, refresh } = useAdminData()
  const activeTab = tabIdFromPath(pathname)
  const navGroups = getVisibleAdminNavGroups()

  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [adminLabel, setAdminLabel] = useState('Administrateur')
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('admin_user')
      if (raw) {
        const user = JSON.parse(raw) as { name?: string; email?: string }
        setAdminLabel(user.name || user.email || 'Administrateur')
      }
    } catch {
      /* ignore */
    }
  }, [])

  // Close menus on route change
  useEffect(() => {
    setOpenGroup(null)
    setUserMenuOpen(false)
  }, [pathname])

  // Close on outside click / Escape
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null)
        setUserMenuOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenGroup(null)
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const badgeFor = (key?: AdminNavItem['badgeKey']): number | undefined => {
    if (key === 'pendingKyc') return stats.pendingKyc
    if (key === 'pendingTransactions') return stats.pendingTransactions
    if (key === 'paymentInitiated') return apeStats.paymentInitiated
    return undefined
  }

  const groupBadgeTotal = (group: AdminNavGroup): number =>
    group.items.reduce((sum, item) => sum + (badgeFor(item.badgeKey) ?? 0), 0)

  const initials = adminLabel
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (token) {
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        })
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_refresh_token')
      localStorage.removeItem('admin_user')
      router.push('/admin/login')
    }
  }

  return (
    <div ref={navRef}>
      {/* Brand (top-left) */}
      <Link href="/admin" className="admin-topnav-brand">
        <Image src="/sama_naffa_logo.png" alt="Sama Naffa" width={2072} height={1164} className="h-7 w-auto" priority />
      </Link>

      {/* Center nav pill with group dropdowns */}
      <nav className="admin-topnav" aria-label="Navigation admin">
        {navGroups.map((group) => {
          const single = group.items.length === 1
          const groupActive = group.items.some((i) => i.id === activeTab)
          const badgeTotal = groupBadgeTotal(group)

          if (single) {
            const item = group.items[0]
            const Icon = item.icon
            return (
              <Link
                key={group.id}
                href={item.href}
                className={`admin-topnav-item ${groupActive ? 'active' : ''}`}
              >
                <Icon className="admin-topnav-item-icon" />
                <span>{item.label}</span>
              </Link>
            )
          }

          const isOpen = openGroup === group.id
          return (
            <div key={group.id} className="admin-topnav-group">
              <button
                type="button"
                className={`admin-topnav-item ${groupActive ? 'active' : ''}`}
                onClick={() => setOpenGroup(isOpen ? null : group.id)}
                aria-expanded={isOpen}
              >
                <span>{group.label}</span>
                {badgeTotal > 0 && <span className="admin-topnav-dot" />}
                <ChevronDown className={`admin-topnav-chevron ${isOpen ? 'open' : ''}`} />
              </button>

              {isOpen && (
                <div className="admin-topnav-dropdown" role="menu">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const badge = badgeFor(item.badgeKey)
                    const itemActive = item.id === activeTab
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`admin-topnav-dropdown-item ${itemActive ? 'active' : ''}`}
                        role="menuitem"
                      >
                        <span className="admin-topnav-dropdown-icon">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {badge !== undefined && badge > 0 && (
                          <span className="admin-topnav-badge">{badge}</span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Right cluster */}
      <div className="admin-topnav-cluster">
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="admin-topnav-icon-btn"
          title="Actualiser les données"
          aria-label="Actualiser"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>

        <div className="admin-topnav-group">
          <button
            type="button"
            className="admin-topnav-user"
            onClick={() => setUserMenuOpen((o) => !o)}
            aria-expanded={userMenuOpen}
          >
            <span className="admin-topnav-avatar">{initials}</span>
          </button>
          {userMenuOpen && (
            <div className="admin-topnav-dropdown admin-topnav-dropdown-right" role="menu">
              <div className="admin-topnav-user-info">
                <span className="admin-topnav-user-name">{adminLabel}</span>
                <span className="admin-topnav-user-role">Administration</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="admin-topnav-dropdown-item"
                role="menuitem"
              >
                <span className="admin-topnav-dropdown-icon">
                  <LogOut className="h-4 w-4" />
                </span>
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
