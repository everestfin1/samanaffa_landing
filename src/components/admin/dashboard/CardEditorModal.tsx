'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { DashboardCardConfig } from '@/lib/admin/types'

const DATA_SOURCE_OPTIONS = [
  { value: 'aum', label: 'AUM (Actifs sous gestion)' },
  { value: 'totalUsers', label: 'Total utilisateurs' },
  { value: 'pendingKyc', label: 'KYC en attente' },
  { value: 'underReviewKyc', label: 'KYC en révision' },
  { value: 'pendingTransactions', label: 'Transactions en attente' },
  { value: 'completedTransactions', label: 'Transactions complétées' },
  { value: 'totalDeposits', label: 'Dépôts totaux' },
  { value: 'totalInvestments', label: 'Investissements totaux' },
  { value: 'recentActivity', label: 'Activité récente' },
  { value: 'kycAction', label: 'Action KYC (CTA)' },
  { value: 'transactionBreakdown', label: 'Répartition transactions' },
]

const CARD_TYPE_OPTIONS = [
  { value: 'stat', label: 'Statistique' },
  { value: 'chart', label: 'Graphique' },
  { value: 'list', label: 'Liste' },
  { value: 'link', label: 'Lien / CTA' },
  { value: 'group', label: 'Groupe' },
]

const COLOR_OPTIONS = [
  { value: 'default', label: 'Blanc', bg: 'bg-white border-slate-200' },
  { value: 'dark', label: 'Sombre', bg: 'bg-[#01081b]' },
  { value: 'green', label: 'Vert', bg: 'bg-[#435933]' },
  { value: 'gradient', label: 'Dégradé', bg: 'bg-gradient-to-br from-[#4a6139] to-[#36482a]' },
  { value: 'amber', label: 'Ambre', bg: 'bg-amber-50' },
  { value: 'blue', label: 'Bleu', bg: 'bg-blue-50' },
  { value: 'red', label: 'Rouge', bg: 'bg-rose-50' },
]

const ICON_KEYS = [
  'Wallet', 'Users', 'ShieldCheck', 'Clock', 'CheckCircle2', 'TrendingUp',
  'ArrowUpRight', 'LayoutDashboard', 'BarChart3', 'List', 'ExternalLink',
]

export default function CardEditorModal({
  card,
  onClose,
  onSave,
  saving,
}: {
  card: DashboardCardConfig | null
  onClose: () => void
  onSave: (card: Partial<DashboardCardConfig>) => void
  saving: boolean
}) {
  const isEdit = !!card
  const [title, setTitle] = useState(card?.title ?? '')
  const [type, setType] = useState(card?.type ?? 'stat')
  const [dataSource, setDataSource] = useState(card?.dataSource ?? 'totalUsers')
  const [color, setColor] = useState(card?.color ?? 'default')
  const [colSpan, setColSpan] = useState(card?.colSpan ?? 3)
  const [rowSpan, setRowSpan] = useState(card?.rowSpan ?? 1)
  const [icon, setIcon] = useState(card?.icon ?? 'LayoutDashboard')
  const [link, setLink] = useState(card?.link ?? '')
  const [visible, setVisible] = useState(card?.visible ?? true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...(isEdit ? { id: card!.id } : {}),
      title,
      type,
      dataSource,
      color,
      colSpan,
      rowSpan,
      icon,
      link: link || undefined,
      visible,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[1.5rem] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">{isEdit ? 'Modifier la carte' : 'Nouvelle carte'}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#435933]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DashboardCardConfig['type'])}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#435933]"
              >
                {CARD_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Source de données</label>
              <select
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#435933]"
              >
                {DATA_SOURCE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Style (couleur)</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`h-10 w-10 rounded-lg border-2 transition-all ${c.bg} ${
                    color === c.value ? 'border-[#435933] ring-2 ring-[#435933]/20' : 'border-transparent'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Largeur: {colSpan}/12 col.</label>
              <input
                type="range"
                min={1}
                max={12}
                value={colSpan}
                onChange={(e) => setColSpan(Number(e.target.value))}
                className="w-full accent-[#435933]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Hauteur: {rowSpan} rang{rowSpan > 1 ? 's' : ''}</label>
              <input
                type="range"
                min={1}
                max={4}
                value={rowSpan}
                onChange={(e) => setRowSpan(Number(e.target.value))}
                className="w-full accent-[#435933]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Icône</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#435933]"
              >
                {ICON_KEYS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Lien (optionnel)</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/admin/..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#435933]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="visible"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#435933] focus:ring-[#435933]"
            />
            <label htmlFor="visible" className="text-sm text-slate-700">Visible</label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#435933] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(67,89,51,0.6)] hover:bg-[#36482a] disabled:opacity-50"
            >
              {saving ? 'Sauvegarde…' : isEdit ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
