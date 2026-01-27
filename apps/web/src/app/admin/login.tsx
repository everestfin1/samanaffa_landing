

import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Shield, AlertCircle, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { apiUrl } from '../../lib/api-config'

export const Route = createFileRoute('/admin/login')({
  component: AdminLogin,
})

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(apiUrl('/api/admin/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const text = await response.text()
      let data: any
      try {
        data = JSON.parse(text)
      } catch {
        data = null
      }

      if (data?.success) {
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_refresh_token', data.refreshToken)
        localStorage.setItem('admin_user', JSON.stringify(data.user))
        ;(navigate as any)({ to: '/admin/' })
      } else {
        setError(data?.error || 'Identifiants invalides')
      }
    } catch {
      setError('Échec de connexion. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    void handleLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-[420px]">
        {/* Branding section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-[#243318] mb-6 shadow-2xl shadow-[#243318]/20 transform rotate-3">
            <Shield className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Admin Console
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.2em]">
            Sama Naffa • Portail Sécurisé
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-[13px] font-black text-slate-900 uppercase tracking-wider ml-1">
                Adresse Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#435933] text-slate-400">
                  <Mail className="w-5 h-5" strokeWidth={2} />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@samanaffa.sn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-[15px] font-bold bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#435933]/5 focus:border-[#435933] focus:bg-white transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="text-[13px] font-black text-slate-900 uppercase tracking-wider">
                  Mot de Passe
                </label>
                <button type="button" className="text-[12px] font-bold text-[#435933] hover:underline">
                  Oublié ?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#435933] text-slate-400">
                  <Lock className="w-5 h-5" strokeWidth={2} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 text-[15px] font-bold bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#435933]/5 focus:border-[#435933] focus:bg-white transition-all placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-2xl text-[14px] font-bold bg-red-50 text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-[#243318] text-white py-4 rounded-2xl text-[15px] font-black shadow-xl shadow-[#243318]/10 hover:shadow-[#243318]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Vérification...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Accéder au dashboard</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.05] to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Accès Strictement Réservé
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <p className="text-slate-400 text-[11px] font-bold">© 2026 EVEREST FINANCE</p>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <p className="text-slate-400 text-[11px] font-bold">V1.0.4</p>
          </div>
        </div>
      </div>
    </div>
  )
}

