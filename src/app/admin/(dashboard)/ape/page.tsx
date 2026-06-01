'use client'

import { useState, useMemo } from 'react'
import { FileSpreadsheet, Search, X, Clock, CheckCircle2, AlertCircle, FileText, Wallet } from 'lucide-react'
import { useAdminData } from '@/lib/admin/AdminDataProvider'
import { fmtFCFA, fmtDate } from '@/lib/admin/format'
import { StatusPill } from '@/components/admin/layout/visuals'
import DetailDrawer from '@/components/admin/layout/DetailDrawer'
import type { ApeSubscription } from '@/lib/admin/types'

const APE_STATUS_LABEL: Record<string, string> = {
  PENDING: 'En attente',
  PAYMENT_INITIATED: 'Paiement initié',
  PAYMENT_SUCCESS: 'Paiement réussi',
  PAYMENT_FAILED: 'Paiement échoué',
  CANCELLED: 'Annulé',
}
const APE_STATUS_OPTIONS = ['PENDING', 'PAYMENT_INITIATED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'CANCELLED']

export default function ApePage() {
  const { apeSubscriptions, apeStats, loading, refresh, authedFetch } = useAdminData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedSub, setSelectedSub] = useState<ApeSubscription | null>(null)
  const [updating, setUpdating] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return apeSubscriptions.filter((s) => {
      if (statusFilter && s.status !== statusFilter) return false
      if (q) {
        const hay = [s.prenom, s.nom, s.email, s.telephone, s.referenceNumber, s.status].filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [apeSubscriptions, statusFilter, search])

  const handleStatusChange = async (subId: string, newStatus: string) => {
    setUpdating((s) => new Set(s).add(subId))
    try {
      const res = await authedFetch(`/api/admin/ape-subscriptions/${subId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        await refresh()
        setSelectedSub(null)
      }
    } catch (err) {
      console.error('Failed to update APE status:', err)
    } finally {
      setUpdating((s) => {
        const next = new Set(s)
        next.delete(subId)
        return next
      })
    }
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[2.25rem] font-bold leading-none tracking-tight">APE Sénégal</h1>
        <p className="mt-2 text-[15px] text-slate-500">Souscriptions obligataires et états de paiement.</p>
      </header>

      {/* Stat bento */}
      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: 'Total', value: apeStats.total, icon: FileText, tone: 'slate' },
          { label: 'En attente', value: apeStats.pending, icon: Clock, tone: 'amber' },
          { label: 'Paiement initié', value: apeStats.paymentInitiated, icon: Wallet, tone: 'blue' },
          { label: 'Réussi', value: apeStats.paymentSuccess, icon: CheckCircle2, tone: 'green' },
          { label: 'Échoué', value: apeStats.paymentFailed, icon: AlertCircle, tone: 'red' },
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

      {/* Filters + search */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher (nom, email, référence...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#435933]"
          />
        </div>
        <div className="flex items-center gap-2">
          {APE_STATUS_OPTIONS.map((s) => (
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
              {APE_STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Active filter chip */}
      {statusFilter && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f8f0] px-3 py-1 text-xs font-semibold text-[#435933]">
            {APE_STATUS_LABEL[statusFilter]}
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Client</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Référence</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Montant</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Statut</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Date</th>
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
                      <FileSpreadsheet size={22} />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Aucune souscription trouvée</p>
                    <p className="mt-1 text-sm text-slate-400">Essayez de modifier vos filtres ou votre recherche.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr
                    key={sub.id}
                    className="group cursor-pointer transition-colors hover:bg-slate-50"
                    onClick={() => setSelectedSub(sub)}
                  >
                    <td className="px-6 py-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{sub.prenom} {sub.nom}</div>
                        <div className="truncate text-xs text-slate-500">{sub.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{sub.referenceNumber}</td>
                    <td className="px-6 py-4 text-sm font-bold tabular-nums">{fmtFCFA(Number(sub.montantCfa) || 0)}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={sub.status} label={APE_STATUS_LABEL[sub.status] ?? sub.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{fmtDate(sub.createdAt)}</td>
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
      <DetailDrawer open={!!selectedSub} onClose={() => setSelectedSub(null)} title="Détails de la souscription">
        {selectedSub && (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-bold">{selectedSub.prenom} {selectedSub.nom}</p>
              <p className="text-sm text-slate-500">{selectedSub.email} · {selectedSub.telephone}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Référence</p>
                <p className="mt-1 text-sm font-mono font-semibold">{selectedSub.referenceNumber}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Montant</p>
                <p className="mt-1 text-sm font-bold tabular-nums">{fmtFCFA(Number(selectedSub.montantCfa) || 0)}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Statut</p>
                <p className="mt-1">
                  <StatusPill status={selectedSub.status} label={APE_STATUS_LABEL[selectedSub.status] ?? selectedSub.status} />
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Date</p>
                <p className="mt-1 text-sm">{fmtDate(selectedSub.createdAt)}</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">Informations complémentaires</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-slate-400">Pays:</span> {selectedSub.paysResidence}</div>
                <div><span className="text-slate-400">Ville:</span> {selectedSub.ville}</div>
                <div><span className="text-slate-400">Catégorie:</span> {selectedSub.categorieSocioprofessionnelle}</div>
                <div><span className="text-slate-400">Tranche:</span> {selectedSub.trancheInteresse}</div>
                {selectedSub.codeParrainage && (
                  <div className="col-span-2"><span className="text-slate-400">Code parrainage:</span> {selectedSub.codeParrainage}</div>
                )}
              </div>
            </div>

            {/* Status actions */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Changer le statut</p>
              <div className="flex flex-wrap gap-2">
                {APE_STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleStatusChange(selectedSub.id, s)}
                    disabled={updating.has(selectedSub.id) || selectedSub.status === s}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                      selectedSub.status === s
                        ? 'bg-[#01081b] text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    } disabled:opacity-50`}
                  >
                    {updating.has(selectedSub.id) && selectedSub.status !== s ? '...' : APE_STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}
