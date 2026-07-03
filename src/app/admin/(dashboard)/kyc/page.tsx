'use client'

import { useState, useMemo, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ShieldCheck, Search, X, Clock, CheckCircle2, AlertCircle, FileText, ExternalLink, Eye } from 'lucide-react'
import { useAdminData } from '@/lib/admin/AdminDataProvider'
import { readApiError } from '@/lib/admin/api-errors'
import { fmtDate } from '@/lib/admin/format'
import { StatusPill, Avatar } from '@/components/admin/layout/visuals'
import DetailDrawer from '@/components/admin/layout/DetailDrawer'
import KycDocumentPreview from '@/components/admin/KycDocumentPreview'
import type { KycDocument } from '@/lib/admin/types'

const KYC_DOC_STATUS_LABEL: Record<string, string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté',
  UNDER_REVIEW: 'En révision',
}
const KYC_DOC_STATUS_OPTIONS = ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW']

export default function KycPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Chargement KYC…</div>}>
      <KycPageContent />
    </Suspense>
  )
}

function KycPageContent() {
  const searchParams = useSearchParams()
  const userIdFilter = searchParams.get('userId')?.trim() ?? ''
  const { kycDocuments, users, loading, refresh, authedFetch, notifyError, notifySuccess } = useAdminData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedDoc, setSelectedDoc] = useState<KycDocument | null>(null)
  const [updating, setUpdating] = useState<Set<string>>(new Set())
  const [adminNotes, setAdminNotes] = useState('')
  const [openingDocId, setOpeningDocId] = useState<string | null>(null)
  const [previewDoc, setPreviewDoc] = useState<KycDocument | null>(null)

  const fetchSignedUrlForDoc = useCallback(
    async (doc: KycDocument) => {
      const res = await authedFetch(`/api/admin/kyc/${doc.id}/signed-url`)
      const data = await res.json()
      if (res.ok && data.url) return data.url as string
      return null
    },
    [authedFetch],
  )

  const openDocument = async (doc: KycDocument) => {
    if (doc.documentType === 'didit_kyc_session') return
    setOpeningDocId(doc.id)
    try {
      const res = await authedFetch(`/api/admin/kyc/${doc.id}/signed-url`)
      const data = await res.json()
      if (res.ok && data.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer')
      } else {
        notifyError(data.error ?? 'Impossible d’ouvrir le document')
      }
    } catch {
      notifyError('Impossible d’ouvrir le document')
    } finally {
      setOpeningDocId(null)
    }
  }

  const isOpenableDocument = (doc: KycDocument) => {
    if (doc.documentType === 'didit_kyc_session') return false
    if (doc.storageKey || doc.fileUrl.startsWith('minio://')) return true
    return doc.fileUrl.startsWith('http')
  }

  const stats = useMemo(() => {
    const total = kycDocuments.length
    const pending = kycDocuments.filter((d) => d.verificationStatus === 'PENDING').length
    const approved = kycDocuments.filter((d) => d.verificationStatus === 'APPROVED').length
    const rejected = kycDocuments.filter((d) => d.verificationStatus === 'REJECTED').length
    return { total, pending, approved, rejected }
  }, [kycDocuments])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return kycDocuments.filter((d) => {
      if (userIdFilter && d.user?.id !== userIdFilter) return false
      if (statusFilter && d.verificationStatus !== statusFilter) return false
      if (q) {
        const hay = [d.documentType, d.fileName, d.user?.name, d.user?.email, d.user?.phone].filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [kycDocuments, statusFilter, search, userIdFilter])

  const handleDocStatusChange = async (docId: string, status: string) => {
    setUpdating((s) => new Set(s).add(docId))
    try {
      const res = await authedFetch(`/api/admin/kyc/${docId}`, {
        method: 'PUT',
        body: JSON.stringify({ verificationStatus: status, adminNotes: adminNotes.trim() || undefined }),
      })
      if (res.ok) {
        await refresh()
        setSelectedDoc(null)
        setAdminNotes('')
        notifySuccess('Document KYC mis à jour')
      } else {
        notifyError(await readApiError(res, 'Impossible de mettre à jour le document'))
      }
    } catch {
      notifyError('Impossible de mettre à jour le document')
    } finally {
      setUpdating((s) => {
        const next = new Set(s)
        next.delete(docId)
        return next
      })
    }
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[2.25rem] font-bold leading-none tracking-tight">Vérification KYC</h1>
        <p className="mt-2 text-[15px] text-slate-500">Documents et décisions de conformité client.</p>
      </header>

      {userIdFilter && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-3 text-sm text-blue-900">
          <span>
            Filtre utilisateur actif — {users.find((u) => u.id === userIdFilter)?.email ?? userIdFilter}
          </span>
          <a href="/admin/kyc" className="font-semibold text-[#435933] hover:underline">
            Afficher tous les documents
          </a>
        </div>
      )}

      {/* Stat bento */}
      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total', value: stats.total, icon: FileText, tone: 'slate' },
          { label: 'En attente', value: stats.pending, icon: Clock, tone: 'amber' },
          { label: 'Approuvés', value: stats.approved, icon: CheckCircle2, tone: 'green' },
          { label: 'Rejetés', value: stats.rejected, icon: AlertCircle, tone: 'red' },
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
            placeholder="Rechercher (client, type de document...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#435933]"
          />
        </div>
        <div className="flex items-center gap-2">
          {KYC_DOC_STATUS_OPTIONS.map((s) => (
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
              {KYC_DOC_STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Active filter chip */}
      {statusFilter && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f8f0] px-3 py-1 text-xs font-semibold text-[#435933]">
            {KYC_DOC_STATUS_LABEL[statusFilter]}
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Document</th>
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
                      <ShieldCheck size={22} />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Aucun document KYC trouvé</p>
                    <p className="mt-1 text-sm text-slate-400">Essayez de modifier vos filtres ou votre recherche.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => (
                  <tr
                    key={doc.id}
                    className="group cursor-pointer transition-colors hover:bg-slate-50"
                    onClick={() => {
                      setSelectedDoc(doc)
                      setAdminNotes('')
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={doc.user?.name || doc.user?.email || '?'} size={32} />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{doc.user?.name || doc.user?.email || 'Client'}</div>
                          <div className="truncate text-xs text-slate-500">{doc.user?.phone || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{doc.documentType}</div>
                      <div className="text-xs text-slate-500">{doc.fileName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={doc.verificationStatus} label={KYC_DOC_STATUS_LABEL[doc.verificationStatus] ?? doc.verificationStatus} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{fmtDate(doc.uploadDate)}</td>
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

      {/* Document detail drawer */}
      <DetailDrawer open={!!selectedDoc} onClose={() => setSelectedDoc(null)} title="Détails du document KYC">
        {selectedDoc && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={selectedDoc.user?.name || selectedDoc.user?.email || '?'} size={56} />
              <div>
                <p className="text-lg font-bold">{selectedDoc.user?.name || selectedDoc.user?.email || 'Client'}</p>
                <p className="text-sm text-slate-500">{selectedDoc.user?.phone || ''}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Type de document</p>
                <p className="mt-1 text-sm font-semibold">{selectedDoc.documentType}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Fichier</p>
                <p className="mt-1 text-sm">{selectedDoc.fileName}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Statut</p>
                <p className="mt-1">
                  <StatusPill status={selectedDoc.verificationStatus} label={KYC_DOC_STATUS_LABEL[selectedDoc.verificationStatus] ?? selectedDoc.verificationStatus} />
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Date d'upload</p>
                <p className="mt-1 text-sm">{fmtDate(selectedDoc.uploadDate)}</p>
              </div>
            </div>

            {selectedDoc.fileUrl && isOpenableDocument(selectedDoc) && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(selectedDoc)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#435933] transition-colors hover:bg-[#f5faf5]"
                >
                  <Eye size={16} />
                  Aperçu
                </button>
                <button
                  type="button"
                  onClick={() => openDocument(selectedDoc)}
                  disabled={openingDocId === selectedDoc.id}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  <ExternalLink size={16} />
                  {openingDocId === selectedDoc.id ? 'Ouverture...' : 'Nouvel onglet'}
                </button>
              </div>
            )}

            {selectedDoc.documentType === 'didit_kyc_session' && (
              <p className="text-sm text-slate-500">
                Session Didit — ouvrez les documents rapatriés (recto, selfie, etc.) dans la liste.
              </p>
            )}

            {selectedDoc.adminNotes && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Notes admin</p>
                <p className="mt-1 text-sm">{selectedDoc.adminNotes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Actions</p>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Notes admin (optionnel)"
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#435933]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDocStatusChange(selectedDoc.id, 'APPROVED')}
                  disabled={updating.has(selectedDoc.id)}
                  className="flex items-center gap-2 rounded-xl bg-[#435933] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(67,89,51,0.6)] transition-colors hover:bg-[#36482a] disabled:opacity-50"
                >
                  <CheckCircle2 size={16} />
                  {updating.has(selectedDoc.id) ? 'Traitement...' : 'Approuver'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDocStatusChange(selectedDoc.id, 'REJECTED')}
                  disabled={updating.has(selectedDoc.id)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
                >
                  <AlertCircle size={16} />
                  {updating.has(selectedDoc.id) ? 'Traitement...' : 'Rejeter'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDocStatusChange(selectedDoc.id, 'UNDER_REVIEW')}
                  disabled={updating.has(selectedDoc.id)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  <Clock size={16} />
                  {updating.has(selectedDoc.id) ? 'Traitement...' : 'En révision'}
                </button>
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>

      {previewDoc && (
        <KycDocumentPreview
          docId={previewDoc.id}
          fileName={previewDoc.fileName}
          fetchSignedUrl={() => fetchSignedUrlForDoc(previewDoc)}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  )
}
