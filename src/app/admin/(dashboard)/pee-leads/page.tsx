'use client'

import { useState, useMemo } from 'react'
import { GraduationCap, Search, X, Clock, CheckCircle2, FileText, Phone } from 'lucide-react'
import { useAdminData } from '@/lib/admin/AdminDataProvider'
import { readApiError } from '@/lib/admin/api-errors'
import { fmtDate } from '@/lib/admin/format'
import { StatusPill } from '@/components/admin/layout/visuals'
import DetailDrawer from '@/components/admin/layout/DetailDrawer'
import type { PeeLead } from '@/lib/admin/types'

const PEE_CRM_LABEL: Record<string, string> = {
  NEW: 'Nouveau',
  CONTACTED: 'Contacté',
  CONVERTED: 'Converti',
  DISMISSED: 'Écarté',
}
const PEE_CRM_OPTIONS = ['NEW', 'CONTACTED', 'CONVERTED', 'DISMISSED'] as const

const PEE_PAYMENT_LABEL: Record<string, string> = {
  PENDING: 'Paiement en attente',
  PAYMENT_INITIATED: 'Paiement initié',
  PAYMENT_SUCCESS: 'Paiement réussi',
  PAYMENT_FAILED: 'Paiement échoué',
  CANCELLED: 'Annulé',
}

function leadCrmStatus(lead: PeeLead): string {
  return lead.crmStatus ?? 'NEW'
}

export default function PeeLeadsPage() {
  const { peeLeads, peeLeadStats, loading, refresh, authedFetch, notifyError, notifySuccess } = useAdminData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedLead, setSelectedLead] = useState<PeeLead | null>(null)
  const [updating, setUpdating] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return peeLeads.filter((l) => {
      const crm = leadCrmStatus(l)
      if (statusFilter && crm !== statusFilter) return false
      if (q) {
        const hay = [l.prenom, l.nom, l.email, l.telephone, l.categorie, l.pays, l.ville, crm, l.status].filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [peeLeads, statusFilter, search])

  const handleCrmStatusChange = async (leadId: string, newCrmStatus: string) => {
    setUpdating((s) => new Set(s).add(leadId))
    try {
      const res = await authedFetch('/api/admin/pee-leads', {
        method: 'PATCH',
        body: JSON.stringify({ id: leadId, crmStatus: newCrmStatus }),
      })
      if (res.ok) {
        await refresh()
        setSelectedLead(null)
        notifySuccess('Statut CRM mis à jour')
      } else {
        notifyError(await readApiError(res, 'Impossible de mettre à jour le lead'))
      }
    } catch {
      notifyError('Impossible de mettre à jour le lead')
    } finally {
      setUpdating((s) => {
        const next = new Set(s)
        next.delete(leadId)
        return next
      })
    }
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[2.25rem] font-bold leading-none tracking-tight">PEE Leads</h1>
        <p className="mt-2 text-[15px] text-slate-500">Leads PEE et suivi de conversion.</p>
      </header>

      {/* Stat bento */}
      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total', value: peeLeadStats.total, icon: FileText, tone: 'slate' },
          { label: 'Nouveaux', value: peeLeadStats.new, icon: Clock, tone: 'amber' },
          { label: 'Contactés', value: peeLeadStats.contacted, icon: Phone, tone: 'blue' },
          { label: 'Convertis', value: peeLeadStats.converted, icon: CheckCircle2, tone: 'green' },
        ].map((s) => {
          const Icon = s.icon
          const toneClass: Record<string, string> = {
            slate: 'text-slate-500',
            amber: 'text-[#C38D1C]',
            blue: 'text-[#0284c7]',
            green: 'text-[#435933]',
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
            placeholder="Rechercher (nom, téléphone, pays...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#435933]"
          />
        </div>
        <div className="flex items-center gap-2">
          {PEE_CRM_OPTIONS.map((s) => (
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
              {PEE_CRM_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Active filter chip */}
      {statusFilter && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f8f0] px-3 py-1 text-xs font-semibold text-[#435933]">
            {PEE_CRM_LABEL[statusFilter]}
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Catégorie</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Localisation</th>
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
                      <GraduationCap size={22} />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Aucun lead trouvé</p>
                    <p className="mt-1 text-sm text-slate-400">Essayez de modifier vos filtres ou votre recherche.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="group cursor-pointer transition-colors hover:bg-slate-50"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-6 py-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{lead.prenom} {lead.nom}</div>
                        <div className="truncate text-xs text-slate-500">{lead.telephone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{lead.categorie}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{lead.ville}, {lead.pays}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={leadCrmStatus(lead)} label={PEE_CRM_LABEL[leadCrmStatus(lead)] ?? leadCrmStatus(lead)} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{fmtDate(lead.createdAt)}</td>
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
      <DetailDrawer open={!!selectedLead} onClose={() => setSelectedLead(null)} title="Détails du lead PEE">
        {selectedLead && (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-bold">{selectedLead.prenom} {selectedLead.nom}</p>
              <p className="text-sm text-slate-500">{selectedLead.telephone} {selectedLead.email ? `· ${selectedLead.email}` : ''}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Référence</p>
                <p className="mt-1 text-sm font-mono font-semibold">{selectedLead.referenceNumber || '—'}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Montant</p>
                <p className="mt-1 text-sm font-bold">{selectedLead.montantCfa ? `${Number(selectedLead.montantCfa).toLocaleString('fr-FR')} FCFA` : '—'}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Catégorie</p>
                <p className="mt-1 text-sm">{selectedLead.categorie}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Statut CRM</p>
                <p className="mt-1">
                  <StatusPill status={leadCrmStatus(selectedLead)} label={PEE_CRM_LABEL[leadCrmStatus(selectedLead)] ?? leadCrmStatus(selectedLead)} />
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Paiement</p>
                <p className="mt-1 text-sm">{PEE_PAYMENT_LABEL[selectedLead.status] ?? selectedLead.status}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 col-span-2">
                <p className="text-xs font-medium text-slate-500">Localisation</p>
                <p className="mt-1 text-sm">{selectedLead.ville}, {selectedLead.pays}</p>
              </div>
            </div>

            {selectedLead.adminNotes && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Notes admin</p>
                <p className="mt-1 text-sm">{selectedLead.adminNotes}</p>
              </div>
            )}

            {/* CRM status actions */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Changer le statut CRM</p>
              <div className="flex flex-wrap gap-2">
                {PEE_CRM_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleCrmStatusChange(selectedLead.id, s)}
                    disabled={updating.has(selectedLead.id) || leadCrmStatus(selectedLead) === s}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                      leadCrmStatus(selectedLead) === s
                        ? 'bg-[#01081b] text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    } disabled:opacity-50`}
                  >
                    {updating.has(selectedLead.id) && leadCrmStatus(selectedLead) !== s ? '...' : PEE_CRM_LABEL[s]}
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
