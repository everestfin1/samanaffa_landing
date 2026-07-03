'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Users, Search, X, ShieldCheck, Clock, CheckCircle2, AlertCircle, FileText, Mail, Phone, Ban, UserCheck } from 'lucide-react'
import { useAdminData } from '@/lib/admin/AdminDataProvider'
import { fmtDate } from '@/lib/admin/format'
import { StatusPill, Avatar } from '@/components/admin/layout/visuals'
import DetailDrawer from '@/components/admin/layout/DetailDrawer'
import type { AdminUser } from '@/lib/admin/types'

const KYC_LABEL: Record<string, string> = {
  APPROVED: 'Approuvé',
  PENDING: 'En attente',
  UNDER_REVIEW: 'En révision',
  REJECTED: 'Rejeté',
}
const KYC_OPTIONS = ['APPROVED', 'PENDING', 'UNDER_REVIEW', 'REJECTED']

export default function UsersPage() {
  const { users, kycDocuments, loading, refresh, authedFetch } = useAdminData()
  const [search, setSearch] = useState('')
  const [kycFilter, setKycFilter] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [updating, setUpdating] = useState<Set<string>>(new Set())
  const [suspendReason, setSuspendReason] = useState('')

  const isUserSuspended = (user: AdminUser) =>
    user.accounts?.some((a) => a.status === 'SUSPENDED') ?? false

  const stats = useMemo(() => {
    const total = users.length
    const pending = users.filter((u) => u.kycStatus === 'PENDING').length
    const approved = users.filter((u) => u.kycStatus === 'APPROVED').length
    const underReview = users.filter((u) => u.kycStatus === 'UNDER_REVIEW').length
    return { total, pending, approved, underReview }
  }, [users])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      if (kycFilter && u.kycStatus !== kycFilter) return false
      if (q) {
        const hay = [u.firstName, u.lastName, u.email, u.phone, u.kycStatus].filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [users, kycFilter, search])

  const userKycDocs = useMemo(() => {
    if (!selectedUser) return []
    return kycDocuments.filter((d) => d.user?.id === selectedUser.id)
  }, [selectedUser, kycDocuments])

  const handleKycStatusChange = async (userId: string, status: string) => {
    setUpdating((s) => new Set(s).add(userId))
    try {
      const res = await authedFetch(`/api/admin/users/${userId}/kyc`, {
        method: 'PUT',
        body: JSON.stringify({ kycStatus: status }),
      })
      if (res.ok) {
        await refresh()
      }
    } catch (err) {
      console.error('Failed to update KYC status:', err)
    } finally {
      setUpdating((s) => {
        const next = new Set(s)
        next.delete(userId)
        return next
      })
    }
  }

  const handleAccountAction = async (userId: string, action: 'suspend' | 'activate') => {
    if (action === 'suspend' && !suspendReason.trim()) {
      alert('Veuillez indiquer un motif de suspension')
      return
    }
    setUpdating((s) => new Set(s).add(userId))
    try {
      const res = await authedFetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({
          action,
          reason: action === 'suspend' ? suspendReason.trim() : undefined,
        }),
      })
      if (res.ok) {
        await refresh()
        setSuspendReason('')
        if (selectedUser?.id === userId) {
          setSelectedUser(null)
        }
      }
    } catch (err) {
      console.error('Failed to update user account status:', err)
    } finally {
      setUpdating((s) => {
        const next = new Set(s)
        next.delete(userId)
        return next
      })
    }
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[2.25rem] font-bold leading-none tracking-tight">Utilisateurs</h1>
        <p className="mt-2 text-[15px] text-slate-500">Comptes clients, statuts KYC et historique.</p>
      </header>

      {/* Stat bento */}
      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total', value: stats.total, icon: Users, tone: 'slate' },
          { label: 'KYC en attente', value: stats.pending, icon: Clock, tone: 'amber' },
          { label: 'KYC approuvé', value: stats.approved, icon: CheckCircle2, tone: 'green' },
          { label: 'En révision', value: stats.underReview, icon: ShieldCheck, tone: 'blue' },
        ].map((s) => {
          const Icon = s.icon
          const toneClass: Record<string, string> = {
            slate: 'text-slate-500',
            amber: 'text-[#C38D1C]',
            green: 'text-[#435933]',
            blue: 'text-[#0284c7]',
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
            placeholder="Rechercher (nom, email, téléphone...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#435933]"
          />
        </div>
        <div className="flex items-center gap-2">
          {KYC_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setKycFilter((prev) => (prev === s ? '' : s))}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                kycFilter === s
                  ? 'bg-[#01081b] text-white'
                  : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {KYC_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Active filter chip */}
      {kycFilter && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f8f0] px-3 py-1 text-xs font-semibold text-[#435933]">
            {KYC_LABEL[kycFilter]}
            <button type="button" onClick={() => setKycFilter('')} className="rounded-full hover:bg-[#e8f5e8] p-0.5">
              <X size={12} />
            </button>
          </span>
          <button type="button" onClick={() => { setKycFilter(''); setSearch('') }} className="text-xs font-medium text-slate-400 hover:text-slate-600 underline">
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">KYC</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Transactions</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Inscription</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 animate-pulse rounded bg-slate-100" style={{ width: `${60 + (j % 3) * 15}%` }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-300">
                      <Users size={22} />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Aucun utilisateur trouvé</p>
                    <p className="mt-1 text-sm text-slate-400">Essayez de modifier vos filtres ou votre recherche.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="group cursor-pointer transition-colors hover:bg-slate-50"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={`${user.firstName} ${user.lastName}`} size={32} />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{user.firstName} {user.lastName}</div>
                          <div className="truncate text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={user.kycStatus} label={KYC_LABEL[user.kycStatus] ?? user.kycStatus} />
                    </td>
                    <td className="px-6 py-4 text-sm font-bold tabular-nums">{user.stats?.totalTransactions ?? 0}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{fmtDate(user.createdAt)}</td>
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

      {/* User detail drawer */}
      <DetailDrawer open={!!selectedUser} onClose={() => setSelectedUser(null)} title="Profil utilisateur">
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={`${selectedUser.firstName} ${selectedUser.lastName}`} size={56} />
              <div>
                <p className="text-lg font-bold">{selectedUser.firstName} {selectedUser.lastName}</p>
                <p className="text-sm text-slate-500">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Téléphone</p>
                <p className="mt-1 text-sm font-semibold">{selectedUser.phone || '—'}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Inscription</p>
                <p className="mt-1 text-sm">{fmtDate(selectedUser.createdAt)}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Transactions</p>
                <p className="mt-1 text-sm font-bold">{selectedUser.stats?.totalTransactions ?? 0}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Documents KYC</p>
                <p className="mt-1 text-sm font-bold">{selectedUser.stats?.totalKycDocuments ?? 0}</p>
              </div>
            </div>

            {/* Account status */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Compte client</p>
              {isUserSuspended(selectedUser) ? (
                <div className="space-y-3">
                  <StatusPill status="SUSPENDED" label="Suspendu" />
                  <button
                    type="button"
                    onClick={() => handleAccountAction(selectedUser.id, 'activate')}
                    disabled={updating.has(selectedUser.id)}
                    className="flex items-center gap-2 rounded-xl bg-[#435933] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    <UserCheck size={16} />
                    {updating.has(selectedUser.id) ? 'Traitement...' : 'Réactiver le compte'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <StatusPill status="ACTIVE" label="Actif" />
                  <textarea
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    placeholder="Motif de suspension (obligatoire)"
                    rows={2}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleAccountAction(selectedUser.id, 'suspend')}
                    disabled={updating.has(selectedUser.id)}
                    className="flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                  >
                    <Ban size={16} />
                    {updating.has(selectedUser.id) ? 'Traitement...' : 'Suspendre le compte'}
                  </button>
                </div>
              )}
            </div>

            <Link
              href={`/admin/kyc?userId=${selectedUser.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#435933] transition-colors hover:bg-[#f5faf5]"
            >
              <FileText size={16} />
              Voir les documents KYC
            </Link>

            {/* KYC status actions */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Statut KYC</p>
              <div className="flex flex-wrap gap-2">
                {KYC_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleKycStatusChange(selectedUser.id, s)}
                    disabled={updating.has(selectedUser.id) || selectedUser.kycStatus === s}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                      selectedUser.kycStatus === s
                        ? 'bg-[#01081b] text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    } disabled:opacity-50`}
                  >
                    {updating.has(selectedUser.id) && selectedUser.kycStatus !== s ? '...' : KYC_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* KYC Documents */}
            {userKycDocs.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700">Documents KYC</p>
                <div className="space-y-2">
                  {userKycDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div>
                        <p className="text-sm font-medium">{doc.documentType}</p>
                        <p className="text-xs text-slate-500">{doc.fileName} · {fmtDate(doc.uploadDate)}</p>
                      </div>
                      <StatusPill status={doc.verificationStatus} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}
