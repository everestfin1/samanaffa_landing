'use client'

import { useState, useMemo } from 'react'
import { CreditCard, Filter, CheckCircle2, XCircle, Clock, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'
import { useAdminData } from '@/lib/admin/AdminDataProvider'
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

export default function TransactionsPage() {
  const { transactions, refresh, authedFetch } = useAdminData()
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [selectedTx, setSelectedTx] = useState<AdminTransaction | null>(null)
  const [updating, setUpdating] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (statusFilter && t.status !== statusFilter) return false
      if (typeFilter && t.intentType !== typeFilter) return false
      return true
    })
  }, [transactions, statusFilter, typeFilter])

  const handleStatusChange = async (txId: string, newStatus: string) => {
    setUpdating((s) => new Set(s).add(txId))
    try {
      const res = await authedFetch(`/api/admin/transactions/${txId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        await refresh()
        setSelectedTx(null)
      }
    } catch (err) {
      console.error('Failed to update transaction status:', err)
    } finally {
      setUpdating((s) => {
        const next = new Set(s)
        next.delete(txId)
        return next
      })
    }
  }

  const uniqueStatuses = Array.from(new Set(transactions.map((t) => t.status)))
  const uniqueTypes = Array.from(new Set(transactions.map((t) => t.intentType)))

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Opérations</p>
          <h1 className="mt-1 text-[2.25rem] font-bold leading-none tracking-tight">Transactions</h1>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#435933]"
          >
            <option value="">Tous les types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>
                {INTENT_LABEL[t] ?? t}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#435933]"
          >
            <option value="">Tous les statuts</option>
            {uniqueStatuses.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s] ?? s}
              </option>
            ))}
          </select>
        </div>
      </header>

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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">
                    Aucune transaction trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const Icon = INTENT_ICON[tx.intentType] ?? CreditCard
                  return (
                    <tr
                      key={tx.id}
                      className="group cursor-pointer transition-colors hover:bg-slate-50"
                      onClick={() => setSelectedTx(tx)}
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
                        <button
                          type="button"
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label="Voir les détails"
                        >
                          <ArrowUpRight size={16} className="text-slate-400" />
                        </button>
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
                <div className="flex gap-2">
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
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}
