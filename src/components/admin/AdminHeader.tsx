'use client'

import { useRouter } from 'next/navigation'
import { RefreshCw, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AdminHeaderProps {
  onRefresh?: () => void
  loading?: boolean
}

export default function AdminHeader({ onRefresh, loading }: AdminHeaderProps) {
  const router = useRouter()
  const [adminLabel, setAdminLabel] = useState('Administrateur')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('admin_user')
      if (!raw) return
      const user = JSON.parse(raw) as { name?: string; email?: string }
      setAdminLabel(user.name || user.email || 'Administrateur')
    } catch {
      /* ignore */
    }
  }, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (token) {
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
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

  const initials = adminLabel
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="admin-chrome">
      <div className="admin-chrome-user">
        <span className="admin-chrome-user-avatar" aria-hidden>
          {initials}
        </span>
        <span>{adminLabel}</span>
      </div>

      {onRefresh ? (
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="admin-btn admin-btn-secondary admin-btn-sm"
          title="Actualiser les données"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Actualiser</span>
        </button>
      ) : null}

      <button
        type="button"
        onClick={handleLogout}
        className="admin-btn admin-btn-ghost admin-btn-sm"
        title="Déconnexion"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Déconnexion</span>
      </button>
    </header>
  )
}
