'use client'

import { useState, useMemo } from 'react'
import { Gift, Search, X, Clock, CheckCircle2, AlertCircle, FileText, Copy } from 'lucide-react'
import { useAdminData } from '@/lib/admin/AdminDataProvider'
import { fmtDate } from '@/lib/admin/format'
import { StatusPill } from '@/components/admin/layout/visuals'
import DetailDrawer from '@/components/admin/layout/DetailDrawer'
import type { SponsorCode } from '@/lib/admin/types'

const SPONSOR_STATUS_LABEL: Record<string, string> = {
  ACTIVE: 'Actif',
  INACTIVE: 'Inactif',
  EXPIRED: 'Expiré',
}
const SPONSOR_STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'EXPIRED']

export default function SponsorCodesPage() {
  const { sponsorCodes, sponsorCodeStats, loading } = useAdminData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedCode, setSelectedCode] = useState<SponsorCode | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return sponsorCodes.filter((c) => {
      if (statusFilter && c.status !== statusFilter) return false
      if (q) {
        const hay = [c.code, c.description, c.status].filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [sponsorCodes, statusFilter, search])

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[2.25rem] font-bold leading-none tracking-tight">Codes parrainage</h1>
        <p className="mt-2 text-[15px] text-slate-500">Codes actifs, inactifs et expirés.</p>
      </header>

      {/* Stat bento */}
      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total', value: sponsorCodeStats.total, icon: FileText, tone: 'slate' },
          { label: 'Actifs', value: sponsorCodeStats.active, icon: CheckCircle2, tone: 'green' },
          { label: 'Inactifs', value: sponsorCodeStats.inactive, icon: Clock, tone: 'amber' },
          { label: 'Expirés', value: sponsorCodeStats.expired, icon: AlertCircle, tone: 'red' },
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

      {/* Filters + search */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#435933]"
          />
        </div>
        <div className="flex items-center gap-2">
          {SPONSOR_STATUS_OPTIONS.map((s) => (
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
              {SPONSOR_STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Active filter chip */}
      {statusFilter && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f8f0] px-3 py-1 text-xs font-semibold text-[#435933]">
            {SPONSOR_STATUS_LABEL[statusFilter]}
            <button type="button" onClick={() => setStatusFilter('')} className="rounded-full hover:bg-[#e8f5e8] p-0.5">
              <X size={12} />
            </button>
          </span>
          <button type="button" onClick={() => { setStatusFilter(''); setSearch('') }} className="text-xs font-medium text-slate-400 hover:text-slate-600 underline">
            Tout effacer
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-[1.5rem] border border-white bg-white shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Code</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Description</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Utilisations</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Statut</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Créé le</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 animate-pulse rounded bg-slate-100" style={{ width: `${60 + (j % 3) * 15}%` }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-300">
                      <Gift size={22} />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Aucun code trouvé</p>
                    <p className="mt-1 text-sm text-slate-400">Essayez de modifier vos filtres ou votre recherche.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((code) => (
                  <tr
                    key={code.id}
                    className="group cursor-pointer transition-colors hover:bg-slate-50"
                    onClick={() => setSelectedCode(code)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-semibold">{code.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{code.description || '—'}</td>
                    <td className="px-6 py-4 text-sm font-bold tabular-nums">{code.usageCount}{code.maxUsage ? ` / ${code.maxUsage}` : ''}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={code.status} label={SPONSOR_STATUS_LABEL[code.status] ?? code.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{fmtDate(code.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <FileText
                        size={16}
                        className="inline-block text-slate-300 transition-all group-hover:text-[#435933] group-hover:translate-x-0.5"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      <DetailDrawer open={!!selectedCode} onClose={() => setSelectedCode(null)} title="Détails du code">
        {selectedCode && (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-bold">{selectedCode.code}</p>
              <p className="text-sm text-slate-500">{selectedCode.description || 'Aucune description'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Utilisations</p>
                <p className="mt-1 text-sm font-bold">{selectedCode.usageCount}{selectedCode.maxUsage ? ` / ${selectedCode.maxUsage}` : ''}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Statut</p>
                <p className="mt-1">
                  <StatusPill status={selectedCode.status} label={SPONSOR_STATUS_LABEL[selectedCode.status] ?? selectedCode.status} />
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Créé le</p>
                <p className="mt-1 text-sm">{fmtDate(selectedCode.createdAt)}</p>
              </div>
              {selectedCode.expiresAt && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">Expire le</p>
                  <p className="mt-1 text-sm">{fmtDate(selectedCode.expiresAt)}</p>
                </div>
              )}
            </div>

            {selectedCode.createdByAdmin && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Créé par</p>
                <p className="mt-1 text-sm">{selectedCode.createdByAdmin.name} · {selectedCode.createdByAdmin.email}</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => { navigator.clipboard.writeText(selectedCode.code) }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#435933] transition-colors hover:bg-[#f5faf5]"
            >
              <Copy size={16} />
              Copier le code
            </button>
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}
