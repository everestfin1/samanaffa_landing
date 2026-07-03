'use client'

import { useState, useMemo } from 'react'
import { CreditCard, CheckCircle2, XCircle, Clock, ArrowUpRight, ArrowDownRight, Wallet, Search, X, FileText, Loader2 } from 'lucide-react'
import { useAdminData } from '@/lib/admin/AdminDataProvider'
import { readApiError } from '@/lib/admin/api-errors'
import { fmtFCFA, fmtDate, fmtDateTime } from '@/lib/admin/format'
import { StatusPill, Avatar } from '@/components/admin/layout/visuals'
import DetailDrawer from '@/components/admin/layout/DetailDrawer'
import type { AdminTransaction } from '@/lib/admin/types'

const INTENT_LABEL: Record<string, string> = {
  DEPOSIT: 'Dépôt',
  INVESTMENT: 'Investissement',
  WITHDRAWAL: 'Retrait',
}
const INTENT_ICON: Record<string, any> = {
  DEPOSIT: ArrowDownRight,
  INVESTMENT: Wallet,
  WITHDRAWAL: ArrowUpRight,
}
const STATUS_LABEL: Record<string, string> = {
  COMPLETED: 'Complété',
  PENDING: 'En attente',
  PROCESSING: 'En cours',
  FAILED: 'Échoué',
}
const STATUS_OPTIONS = ['COMPLETED', 'PENDING', 'PROCESSING', 'FAILED']
const TYPE_OPTIONS = ['DEPOSIT', 'INVESTMENT', 'WITHDRAWAL']

function SkeletonRow({ cols = 7 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 animate-pulse rounded bg-slate-100" style={{ width: `${60 + (i % 3) * 15}%` }} />
        </td>
      ))}
    </tr>
  )
}

export default function TransactionsPage() {
  const { transactions, loading, refresh, authedFetch, notifyError, notifySuccess } = useAdminData()
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [search, setSearch] = useState('')
  const [selectedTx, setSelectedTx] = useState<AdminTransaction | null>(null)
  const [updating, setUpdating] = useState<Set<string>>(new Set())
  const [adminNotes, setAdminNotes] = useState('')

  const stats = useMemo(() => {
    const total = transactions.length
    const pending = transactions.filter((t) => t.status === 'PENDING').length
    const completed = transactions.filter((t) => t.status === 'COMPLETED').length
    const failed = transactions.filter((t) => t.status === 'FAILED').length
    const volume = transactions
      .filter((t) => t.status === 'COMPLETED')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
    return { total, pending, completed, failed, volume }
  }, [transactions])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return transactions.filter((t) => {
      if (statusFilter && t.status !== statusFilter) return false
      if (typeFilter && t.intentType !== typeFilter) return false
      if (q) {
        const hay = [
          t.referenceNumber,
          t.user?.name,
          t.user?.email,
          t.user?.phone,
          t.intentType,
          t.status,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [transactions, statusFilter, typeFilter, search])

  const handleStatusChange = async (txId: string, newStatus: string) => {
    setUpdating((s) => new Set(s).add(txId))
    try {
      const res = await authedFetch(`/api/admin/transactions/${txId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, adminNotes: adminNotes.trim() || undefined }),
      })
      if (res.ok) {
        await refresh()
        setSelectedTx(null)
        setAdminNotes('')
        notifySuccess('Statut de la transaction mis à jour')
      } else {
        notifyError(await readApiError(res, 'Impossible de mettre à jour la transaction'))
      }
    } catch {
      notifyError('Impossible de mettre à jour la transaction')
    } finally {
      setUpdating((s) => {
        const next = new Set(s)
        next.delete(txId)
        return next
      })
    }
  }

  const activeFilters = [
    ...(statusFilter ? [{ key: 'status', label: STATUS_LABEL[statusFilter] ?? statusFilter, clear: () => setStatusFilter('') }] : []),
    ...(typeFilter ? [{ key: 'type', label: INTENT_LABEL[typeFilter] ?? typeFilter, clear: () => setTypeFilter('') }] : []),
  ]

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[2.25rem] font-bold leading-none tracking-tight">Transactions</h1>
        <p className="mt-2 text-[15px] text-slate-500">Suivi des dépôts et paiements, filtrage par statut.</p>
      </header>

      {/* Stat bento */}
      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: 'Total', value: stats.total, icon: FileText, tone: 'slate' },
          { label: 'En attente', value: stats.pending, icon: Clock, tone: 'amber' },
          { label: 'Complétées', value: stats.completed, icon: CheckCircle2, tone: 'green' },
          { label: 'Échouées', value: stats.failed, icon: XCircle, tone: 'red' },
          { label: 'Volume (FCFA)', value: fmtFCFA(stats.volume), icon: Wallet, tone: 'slate', raw: true },
        ].map((s) => {
          const Icon = s.icon
          const toneClass: Record<string, string> = {
            slate: 'text-slate-500',
            amber: 'text-[#C38D1C]',
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
                {loading ? <span className="inline-block h-7 w-16 animate-pulse rounded bg-slate-100" /> : s.raw ? s.value : s.value}
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
            placeholder="Rechercher (client, référence, statut...)"
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
          {TYPE_OPTIONS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter((prev) => (prev === t ? '' : t))}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                typeFilter === t
                  ? 'bg-[#435933] text-white'
                  : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {INTENT_LABEL[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f8f0] px-3 py-1 text-xs font-semibold text-[#435933]"
            >
              {f.label}
              <button type="button" onClick={f.clear} className="rounded-full hover:bg-[#e8f5e8] p-0.5">
                <X size={12} />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => { setStatusFilter(''); setTypeFilter(''); setSearch('') }}
            className="text-xs font-medium text-slate-400 hover:text-slate-600 underline"
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Référence</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Client</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Type</th>
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
                    <SkeletonRow key={i} />
                  ))}
                </>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-300">
                      <FileText size={22} />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Aucune transaction trouvée</p>
                    <p className="mt-1 text-sm text-slate-400">Essayez de modifier vos filtres ou votre recherche.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const Icon = INTENT_ICON[tx.intentType] ?? CreditCard
                  return (
                    <tr
                      key={tx.id}
                      className="group cursor-pointer transition-colors hover:bg-slate-50"
                      onClick={() => {
                        setSelectedTx(tx)
                        setAdminNotes('')
                      }}
                    >
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">{tx.referenceNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={tx.user?.name || tx.user?.email || '?'} size={32} />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">{tx.user?.name || tx.user?.email || 'Client'}</div>
                            <div className="truncate text-xs text-slate-500">{tx.user?.phone || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <Icon size={16} className="text-slate-400" />
                          {INTENT_LABEL[tx.intentType] ?? tx.intentType}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold tabular-nums">{fmtFCFA(Number(tx.amount))}</td>
                      <td className="px-6 py-4">
                        <StatusPill status={tx.status} label={STATUS_LABEL[tx.status] ?? tx.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{fmtDate(tx.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <ArrowUpRight
                          size={16}
                          className="inline-block text-slate-300 transition-all group-hover:text-[#435933] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetailDrawer open={!!selectedTx} onClose={() => setSelectedTx(null)} title="Détails de la transaction">
        {selectedTx && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={selectedTx.user?.name || selectedTx.user?.email || '?'} size={56} />
              <div>
                <p className="text-lg font-bold">{selectedTx.user?.name || selectedTx.user?.email || 'Client'}</p>
                <p className="text-sm text-slate-500">{selectedTx.user?.phone || ''}</p>
                <p className="text-sm text-slate-500">{selectedTx.user?.email || ''}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Référence</p>
                <p className="mt-1 text-sm font-mono font-semibold">{selectedTx.referenceNumber}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Type</p>
                <p className="mt-1 text-sm font-semibold">{INTENT_LABEL[selectedTx.intentType] ?? selectedTx.intentType}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Montant</p>
                <p className="mt-1 text-sm font-bold tabular-nums">{fmtFCFA(Number(selectedTx.amount))}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Statut</p>
                <p className="mt-1">
                  <StatusPill status={selectedTx.status} label={STATUS_LABEL[selectedTx.status] ?? selectedTx.status} />
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">Date de création</p>
              <p className="mt-1 text-sm">{fmtDateTime(selectedTx.createdAt)}</p>
            </div>

            {selectedTx.status === 'PENDING' && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700">Actions</p>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes admin (optionnel)"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#435933]"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedTx.id, 'PROCESSING')}
                    disabled={updating.has(selectedTx.id)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Loader2 size={16} />
                    {updating.has(selectedTx.id) ? 'Traitement...' : 'Marquer en cours'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedTx.id, 'COMPLETED')}
                    disabled={updating.has(selectedTx.id)}
                    className="flex items-center gap-2 rounded-xl bg-[#435933] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(67,89,51,0.6)] transition-colors hover:bg-[#36482a] disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    {updating.has(selectedTx.id) ? 'Traitement...' : 'Approuver'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedTx.id, 'FAILED')}
                    disabled={updating.has(selectedTx.id)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    {updating.has(selectedTx.id) ? 'Traitement...' : 'Rejeter'}
                  </button>
                </div>
              </div>
            )}

            {selectedTx.status === 'PROCESSING' && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700">Finaliser le traitement</p>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes admin (optionnel)"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#435933]"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedTx.id, 'COMPLETED')}
                    disabled={updating.has(selectedTx.id)}
                    className="flex items-center gap-2 rounded-xl bg-[#435933] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(67,89,51,0.6)] transition-colors hover:bg-[#36482a] disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    {updating.has(selectedTx.id) ? 'Traitement...' : 'Compléter'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedTx.id, 'FAILED')}
                    disabled={updating.has(selectedTx.id)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    {updating.has(selectedTx.id) ? 'Traitement...' : 'Échouer'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}
