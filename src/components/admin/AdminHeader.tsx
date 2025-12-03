'use client'

import { useRouter } from 'next/navigation'
import { RefreshCw, LogOut, Bell, Search } from 'lucide-react'
import { useState } from 'react'

interface AdminHeaderProps {
  title: string
  subtitle?: string
  onRefresh?: () => void
  loading?: boolean
}

export default function AdminHeader({ title, subtitle, onRefresh, loading }: AdminHeaderProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (token) {
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_refresh_token')
      localStorage.removeItem('admin_user')
      router.push('/admin/login')
    }
  }

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-inner">
        {/* Page Title */}
        <div className="admin-topbar-title">
          <h1 className="admin-topbar-heading">{title}</h1>
          {subtitle && <p className="admin-topbar-subtitle">{subtitle}</p>}
        </div>

        {/* Search Bar */}
        <div className="admin-topbar-search">
          <Search className="admin-topbar-search-icon" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-topbar-search-input"
          />
        </div>

        {/* Actions */}
        <div className="admin-topbar-actions">
          <button 
            className="admin-topbar-action-btn"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="admin-topbar-action-badge">3</span>
          </button>

          {onRefresh && (
            <button 
              onClick={onRefresh}
              disabled={loading}
              className="admin-btn admin-btn-secondary"
              title="Actualiser"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
          )}

          <button 
            onClick={handleLogout}
            className="admin-btn admin-btn-ghost"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  )
}
