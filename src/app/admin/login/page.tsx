'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, AlertCircle } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_refresh_token', data.refreshToken)
        localStorage.setItem('admin_user', JSON.stringify(data.user))
        router.push('/admin')
      } else {
        setError(data.error || 'Échec de connexion')
      }
    } catch {
      setError('Échec de connexion. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--admin-primary)] mb-5">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-[var(--admin-text-primary)] mb-1">
            Administration
          </h1>
          <p className="text-[var(--admin-text-muted)] text-sm">
            Sama Naffa • Portail sécurisé
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-lg border border-[var(--admin-border-light)] shadow-sm p-6">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="admin-label">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                placeholder="admin@samanaffa.sn"
              />
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="admin-label">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                placeholder="••••••••••••"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md text-sm bg-[var(--admin-rose-bg)] text-[var(--admin-rose)] border border-[var(--admin-rose)]/20">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="admin-btn admin-btn-primary w-full py-2.5 text-sm font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connexion...</span>
                </div>
              ) : (
                <span>Se connecter</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[var(--admin-text-dim)] text-xs">
            Accès réservé aux administrateurs
          </p>
          <p className="text-[var(--admin-text-dim)] text-xs mt-1 opacity-60">
            © {new Date().getFullYear()} Everest Finance SGI
          </p>
        </div>
      </div>
    </div>
  )
}
