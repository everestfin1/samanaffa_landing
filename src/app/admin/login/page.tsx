'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { AlertCircle } from 'lucide-react'

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
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-logo-wrap">
            <Image
              src="/sama_naffa_logo.png"
              alt="Sama Naffa"
              width={160}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
          <h1 className="admin-login-title">Administration</h1>
          <p className="admin-login-subtitle">
            Portail sécurisé · Everest Finance SGI
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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

          {error && (
            <div className="admin-login-error" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary w-full py-3 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connexion…
              </span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <p className="admin-login-footer">
          Accès réservé aux administrateurs
          <br />
          © {new Date().getFullYear()} Everest Finance SGI
        </p>
      </div>
    </div>
  )
}
