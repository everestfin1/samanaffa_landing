'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Gift, Search, Plus, X, Clock, CheckCircle2, AlertCircle, Copy, Power } from 'lucide-react'
import { fmtDate } from '@/lib/admin/format'
import { StatusPill } from '@/components/admin/layout/visuals'
import DetailDrawer from '@/components/admin/layout/DetailDrawer'
import type { SponsorCode } from '@/lib/admin/types'

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: 'Actif',
  INACTIVE: 'Inactif',
  EXPIRED: 'Expiré',
}
const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'EXPIRED']

const emptyForm = {
  code: '',
  name: '',
  description: '',
  phone: '',
  email: '',
  region: '',
  maxUsage: '',
  expiresAt: '',
}

export default function SponsorCodesPage() {
  const [codes, setCodes] = useState<SponsorCode[]>([])
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, expired: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<SponsorCode | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const authHeaders = useCallback((): HeadersInit => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const qs = statusFilter ? `?status=${statusFilter}` : ''
      const res = await fetch(`/api/admin/sponsor-codes${qs}`, { headers: authHeaders() })
      const data = await res.json()
      if (data.success) {
        setCodes(data.codes)
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Error loading referral codes:', err)
    } finally {
      setLoading(false)
    }
  }, [authHeaders, statusFilter])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return codes
    return codes.filter((c) =>
      [c.code, c.name, c.description, c.region, c.phone, c.email, c.status]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [codes, search])

  const handleCreate = async () => {
    setFormError(null)
    if (form.code.trim().length < 3 || !form.name.trim()) {
      setFormError('Code (3+ caractères) et nom agent sont requis')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/sponsor-codes', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          ...form,
          maxUsage: form.maxUsage ? parseInt(form.maxUsage, 10) : null,
          expiresAt: form.expiresAt || null,
        }),
      })
      const data = await res.json()
      if (!data.success) {
        setFormError(data.error ?? 'Erreur')
        return
      }
      setShowModal(false)
      setForm(emptyForm)
      await load()
    } catch (err) {
      console.error('Error creating code:', err)
      setFormError('Erreur lors de la création')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (code: SponsorCode) => {
    const next = code.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    try {
      await fetch('/api/admin/sponsor-codes', {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ id: code.id, status: next }),
      })
      await load()
      if (selected?.id === code.id) {
        setSelected((prev) => (prev ? { ...prev, status: next } : null))
      }
    } catch (err) {
      console.error('Error updating code status:', err)
    }
  }

  return (
    <div>
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[2.25rem] font-bold leading-none tracking-tight">Codes parrainage</h1>
          <p className="mt-2 text-[15px] text-slate-500">
            Codes agents Sama Naffa — validité, utilisations et performance d’acquisition.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setForm(emptyForm); setFormError(null); setShowModal(true) }}
          className="inline-flex items-center gap-2 rounded-full bg-[#01081b] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0a1533]"
        >
          <Plus size={16} />
          Nouveau code
        </button>
      </header>

      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total', value: stats.total, icon: Gift, tone: 'slate' },
          { label: 'Actifs', value: stats.active, icon: CheckCircle2, tone: 'green' },
          { label: 'Inactifs', value: stats.inactive, icon: Clock, tone: 'amber' },
          { label: 'Expirés', value: stats.expired, icon: AlertCircle, tone: 'red' },
        ].map((s) => {
          const Icon = s.icon
          const toneClass: Record<string, string> = {
            slate: 'text-slate-500',
            green: 'text-[#435933]',
            amber: 'text-[#C38D1C]',
            red: 'text-rose-500',
          }
          return (
            <div
              key={s.label}
              className="flex flex-col justify-between rounded-[1.25rem] border border-white bg-white p-5 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.1)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{s.label}</span>
                <Icon size={15} className={toneClass[s.tone]} />
              </div>
              <div className="mt-3 text-2xl font-bold tracking-tight tabular-nums">
                {loading ? <span className="inline-block h-7 w-12 animate-pulse rounded bg-slate-100" /> : s.value}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un code ou un agent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#435933]"
          />
        </div>
        <div className="flex items-center gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter((prev) => (prev === s ? '' : s))}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? 'bg-[#01081b] text-white'
                  : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-white bg-white shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100 bg-slate-50/50">
              <tr>
                {['Code', 'Agent', 'Utilisations', 'Inscriptions', 'Statut', 'Expire le', ''].map((h) => (
                  <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 animate-pulse rounded bg-slate-100" style={{ width: `${50 + (j % 3) * 20}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-300">
                      <Gift size={22} />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Aucun code trouvé</p>
                  </td>
                </tr>
              ) : (
                filtered.map((code) => (
                  <tr
                    key={code.id}
                    className="group cursor-pointer transition-colors hover:bg-slate-50"
                    onClick={() => setSelected(code)}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-semibold">{code.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-700">{code.name || '—'}</div>
                      <div className="text-xs text-slate-400">{code.region || code.description || '—'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold tabular-nums">
                      {code.usageCount}
                      {code.maxUsage ? ` / ${code.maxUsage}` : ''}
                    </td>
                    <td className="px-6 py-4 text-sm tabular-nums">{code.stats?.signups ?? 0}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={code.status} label={STATUS_LABEL[code.status] ?? code.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {code.expiresAt ? fmtDate(code.expiresAt) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => toggleStatus(code)}
                        title={code.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      >
                        <Power size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetailDrawer open={!!selected} onClose={() => setSelected(null)} title="Détails du code">
        {selected && (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-bold font-mono">{selected.code}</p>
              <p className="text-sm text-slate-500">{selected.name}</p>
              {selected.description && <p className="mt-1 text-sm text-slate-600">{selected.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Utilisations</p>
                <p className="mt-1 text-sm font-bold">
                  {selected.usageCount}
                  {selected.maxUsage ? ` / ${selected.maxUsage}` : ''}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Statut</p>
                <p className="mt-1">
                  <StatusPill status={selected.status} label={STATUS_LABEL[selected.status] ?? selected.status} />
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Inscriptions</p>
                <p className="mt-1 text-sm font-bold">{selected.stats?.signups ?? 0}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">KYC approuvés</p>
                <p className="mt-1 text-sm font-bold text-[#435933]">{selected.stats?.kycApproved ?? 0}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Dépôts confirmés</p>
                <p className="mt-1 text-sm font-bold">{selected.stats?.depositsConfirmed ?? 0}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Expire le</p>
                <p className="mt-1 text-sm">{selected.expiresAt ? fmtDate(selected.expiresAt) : '—'}</p>
              </div>
            </div>

            {(selected.phone || selected.email || selected.region) && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">
                {[selected.phone, selected.email, selected.region].filter(Boolean).join(' · ')}
              </div>
            )}

            <button
              type="button"
              onClick={() => { navigator.clipboard.writeText(selected.code) }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#435933] transition-colors hover:bg-[#f5faf5]"
            >
              <Copy size={16} />
              Copier le code
            </button>
          </div>
        )}
      </DetailDrawer>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">Nouveau code de parrainage</h2>
              <button type="button" onClick={() => setShowModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {([
                { key: 'code', label: 'Code *', placeholder: 'AG-DAKAR-01' },
                { key: 'name', label: 'Nom de l’agent *', placeholder: 'Awa Diop' },
                { key: 'description', label: 'Description', placeholder: 'Agent terrain Dakar' },
                { key: 'phone', label: 'Téléphone', placeholder: '+221…' },
                { key: 'email', label: 'Email', placeholder: 'awa@…' },
                { key: 'region', label: 'Région / zone', placeholder: 'Dakar' },
                { key: 'maxUsage', label: 'Limite d’utilisations (vide = illimité)', placeholder: '100' },
              ] as const).map((f) => (
                <label key={f.key} className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-600">{f.label}</span>
                  <input
                    type="text"
                    value={form[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#435933]"
                  />
                </label>
              ))}
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-600">Date d’expiration (optionnel)</span>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#435933]"
                />
              </label>
              {formError && <p className="text-sm text-rose-500">{formError}</p>}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Annuler
              </button>
              <button type="button" onClick={handleCreate} disabled={saving} className="rounded-full bg-[#01081b] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0a1533] disabled:opacity-50">
                {saving ? 'Création…' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
