'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Archive, Clock, CheckCircle2, Mail, Phone, Search, UserCheck, X, XCircle } from 'lucide-react'
import { useAdminData } from '@/lib/admin/AdminDataProvider'
import { readApiError } from '@/lib/admin/api-errors'
import { fmtDate } from '@/lib/admin/format'
import { StatusPill } from '@/components/admin/layout/visuals'
import DetailDrawer from '@/components/admin/layout/DetailDrawer'

interface AbandonedLead {
  id: string
  anonymousId: string
  formType: string
  email?: string | null
  phone?: string | null
  stepReached?: string | null
  fieldsCompleted?: number | null
  totalFields?: number | null
  score: number
  status: string
  adminNotes?: string | null
  lastActivityAt: string
  firstSeenAt: string
}

interface AbandonedLeadStats {
  total: number
  abandoned: number
  contacted: number
  converted: number
  dismissed: number
}

const STATUS_LABEL: Record<string, string> = {
  ABANDONED: 'Abandonné',
  CONTACTED: 'Contacté',
  CONVERTED: 'Converti',
  DISMISSED: 'Écarté',
}
const STATUS_OPTIONS = ['ABANDONED', 'CONTACTED', 'CONVERTED', 'DISMISSED']

export default function AbandonedLeadsTab() {
  const { authedFetch, notifyError, notifySuccess } = useAdminData()
  const [leads, setLeads] = useState<AbandonedLead[]>([])
  const [stats, setStats] = useState<AbandonedLeadStats>({
    total: 0,
    abandoned: 0,
    contacted: 0,
    converted: 0,
    dismissed: 0,
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedLead, setSelectedLead] = useState<AbandonedLead | null>(null)
  const [notes, setNotes] = useState('')
  const [updating, setUpdating] = useState(false)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authedFetch('/api/admin/abandoned-leads')
      const data = await res.json()
      if (data.success) {
        setLeads(data.drafts)
        setStats(data.stats)
      } else {
        notifyError(data.error ?? 'Impossible de charger les leads abandonnés')
      }
    } catch {
      notifyError('Impossible de charger les leads abandonnés')
    } finally {
      setLoading(false)
    }
  }, [authedFetch, notifyError])

  useEffect(() => {
    void fetchLeads()
  }, [fetchLeads])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return leads.filter((lead) => {
      if (statusFilter && lead.status !== statusFilter) return false
      if (q) {
        const hay = [lead.email, lead.phone, lead.formType, lead.stepReached, lead.status, lead.anonymousId]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [leads, statusFilter, search])

  const handleUpdate = async (status: string) => {
    if (!selectedLead) return
    setUpdating(true)
    try {
      const res = await authedFetch('/api/admin/abandoned-leads', {
        method: 'PATCH',
        body: JSON.stringify({
          id: selectedLead.id,
          status,
          adminNotes: notes,
        }),
      })
      const data = await res.json()
      if (data.success) {
        await fetchLeads()
        setSelectedLead(null)
        setNotes('')
        notifySuccess('Lead mis à jour')
      } else {
        notifyError(data.error ?? (await readApiError(res, 'Erreur lors de la mise à jour')))
      }
    } catch {
      notifyError('Erreur lors de la mise à jour du lead abandonné')
    } finally {
      setUpdating(false)
    }
  }

  const openLead = (lead: AbandonedLead) => {
    setSelectedLead(lead)
    setNotes(lead.adminNotes || '')
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[2.25rem] font-bold leading-none tracking-tight">Leads abandonnés</h1>
        <p className="mt-2 text-[15px] text-slate-500">
          Parcours d&apos;onboarding non terminés — relance et suivi acquisition.
        </p>
      </header>

      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: 'Total', value: stats.total, icon: Archive, tone: 'slate' },
          { label: 'Abandonnés', value: stats.abandoned, icon: Clock, tone: 'amber' },
          { label: 'Contactés', value: stats.contacted, icon: Phone, tone: 'blue' },
          { label: 'Convertis', value: stats.converted, icon: CheckCircle2, tone: 'green' },
          { label: 'Écartés', value: stats.dismissed, icon: XCircle, tone: 'red' },
        ].map((s) => {
          const Icon = s.icon
          const toneClass: Record<string, string> = {
            slate: 'text-slate-500',
            amber: 'text-[#C38D1C]',
            blue: 'text-[#0284c7]',
            green: 'text-[#435933]',
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
        <div className="relative min-w-[220px] flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher (email, téléphone, formulaire...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#435933]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
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

      {statusFilter && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f8f0] px-3 py-1 text-xs font-semibold text-[#435933]">
            {STATUS_LABEL[statusFilter]}
            <button type="button" onClick={() => setStatusFilter('')} className="rounded-full p-0.5 hover:bg-[#e8f5e8]">
              <X size={12} />
            </button>
          </span>
          <button
            type="button"
            onClick={() => { setStatusFilter(''); setSearch('') }}
            className="text-xs font-medium text-slate-400 underline hover:text-slate-600"
          >
            Tout effacer
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-[1.5rem] border border-white bg-white shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Formulaire</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Progression</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Score</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Statut</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Activité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 animate-pulse rounded bg-slate-100" style={{ width: `${55 + (j % 3) * 18}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-300">
                      <Archive size={22} />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Aucun lead abandonné</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Les brouillons apparaîtront ici lorsque la télémétrie formulaire est active.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => {
                  const completionRate = lead.totalFields
                    ? Math.round(((lead.fieldsCompleted || 0) / lead.totalFields) * 100)
                    : 0
                  return (
                    <tr
                      key={lead.id}
                      className="group cursor-pointer transition-colors hover:bg-slate-50"
                      onClick={() => openLead(lead)}
                    >
                      <td className="px-6 py-4">
                        <div className="min-w-0 text-sm">
                          {lead.email && (
                            <div className="flex items-center gap-1.5 truncate font-medium">
                              <Mail size={14} className="shrink-0 text-slate-400" />
                              {lead.email}
                            </div>
                          )}
                          {lead.phone && (
                            <div className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500">
                              <Phone size={14} className="shrink-0 text-slate-400" />
                              {lead.phone}
                            </div>
                          )}
                          {!lead.email && !lead.phone && (
                            <span className="text-slate-400">Anonyme</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{lead.formType}</div>
                        {lead.stepReached && (
                          <div className="text-xs text-slate-500">Étape : {lead.stepReached}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm tabular-nums">
                        {lead.fieldsCompleted ?? 0}/{lead.totalFields ?? 0}
                        <div className="text-xs text-slate-500">{completionRate}%</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold tabular-nums">{lead.score}</td>
                      <td className="px-6 py-4">
                        <StatusPill status={lead.status} label={STATUS_LABEL[lead.status] ?? lead.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{fmtDate(lead.lastActivityAt)}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetailDrawer open={!!selectedLead} onClose={() => setSelectedLead(null)} title="Lead abandonné">
        {selectedLead && (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-bold">{selectedLead.formType}</p>
              <p className="text-sm text-slate-500">
                Score {selectedLead.score} · {selectedLead.fieldsCompleted ?? 0}/{selectedLead.totalFields ?? 0} champs
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Statut</p>
                <p className="mt-1">
                  <StatusPill status={selectedLead.status} label={STATUS_LABEL[selectedLead.status] ?? selectedLead.status} />
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Dernière activité</p>
                <p className="mt-1 text-sm">{fmtDate(selectedLead.lastActivityAt)}</p>
              </div>
              {selectedLead.stepReached && (
                <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">Dernière étape atteinte</p>
                  <p className="mt-1 text-sm">{selectedLead.stepReached}</p>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">
              <p className="text-xs font-medium text-slate-500">Contact</p>
              <div className="mt-2 space-y-1">
                {selectedLead.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-slate-400" />
                    {selectedLead.email}
                  </div>
                )}
                {selectedLead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-slate-400" />
                    {selectedLead.phone}
                  </div>
                )}
                {!selectedLead.email && !selectedLead.phone && (
                  <p className="text-slate-500">Aucune information de contact</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="abandoned-lead-notes" className="mb-2 block text-sm font-semibold text-slate-700">
                Notes internes
              </label>
              <textarea
                id="abandoned-lead-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Commentaire pour l'équipe commerciale"
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#435933]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleUpdate('CONTACTED')}
                disabled={updating}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <Phone size={16} />
                {updating ? 'Traitement…' : 'Marquer contacté'}
              </button>
              <button
                type="button"
                onClick={() => handleUpdate('CONVERTED')}
                disabled={updating}
                className="flex items-center gap-2 rounded-xl bg-[#435933] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                <UserCheck size={16} />
                Converti
              </button>
              <button
                type="button"
                onClick={() => handleUpdate('DISMISSED')}
                disabled={updating}
                className="flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
              >
                <XCircle size={16} />
                Écarter
              </button>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}
