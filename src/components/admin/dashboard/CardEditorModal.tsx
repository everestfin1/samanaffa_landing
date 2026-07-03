'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { DashboardCardConfig } from '@/lib/admin/types'
import { DASHBOARD_CARD_TYPES, DASHBOARD_ICONS } from '@/lib/admin/dashboard-config-validation'
import {
  DASHBOARD_CARD_TEMPLATES,
  DASHBOARD_DATA_SOURCE_REGISTRY,
  getVisibleDataSourceCategories,
  defaultsFromDataSource,
  isLegacyCampaignDataSource,
  type DashboardDataSourceId,
} from '@/lib/admin/dashboard-data-registry'
import { isLegacyAdminNavHidden } from '@/lib/product-flags'

const CARD_TYPE_LABELS: Record<(typeof DASHBOARD_CARD_TYPES)[number], string> = {
  stat: 'Statistique',
  chart: 'Graphique',
  list: 'Liste',
  link: 'Lien / CTA',
  group: 'Groupe',
}

const COLOR_OPTIONS = [
  { value: 'default', label: 'Blanc', bg: 'bg-white border-slate-200' },
  { value: 'dark', label: 'Sombre', bg: 'bg-[#01081b]' },
  { value: 'green', label: 'Vert', bg: 'bg-[#435933]' },
  { value: 'gradient', label: 'Dégradé', bg: 'bg-gradient-to-br from-[#4a6139] to-[#36482a]' },
  { value: 'amber', label: 'Ambre', bg: 'bg-amber-50' },
  { value: 'blue', label: 'Bleu', bg: 'bg-blue-50' },
  { value: 'red', label: 'Rouge', bg: 'bg-rose-50' },
]

function applySourceDefaults(
  source: string,
  setters: {
    setType: (v: DashboardCardConfig['type']) => void
    setTitle: (v: string) => void
    setIcon: (v: string) => void
    setLink: (v: string) => void
    setColSpan: (v: number) => void
    setRowSpan: (v: number) => void
  },
  options?: { fillTitle?: boolean },
) {
  const meta = DASHBOARD_DATA_SOURCE_REGISTRY[source as DashboardDataSourceId]
  if (!meta) return
  setters.setType(meta.defaultType)
  if (options?.fillTitle) setters.setTitle(meta.defaultTitle)
  setters.setIcon(meta.defaultIcon)
  setters.setLink(meta.defaultLink ?? '')
  if (meta.defaultColSpan) setters.setColSpan(meta.defaultColSpan)
  if (meta.defaultRowSpan) setters.setRowSpan(meta.defaultRowSpan)
}

export default function CardEditorModal({
  card,
  isNew,
  onClose,
  onSave,
  saving,
}: {
  card: DashboardCardConfig | null
  isNew?: boolean
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
  const hideLegacy = isLegacyAdminNavHidden()
  const visibleCategories = getVisibleDataSourceCategories(hideLegacy)
  const visibleTemplates = DASHBOARD_CARD_TEMPLATES.filter(
    (tpl) => !hideLegacy || !isLegacyCampaignDataSource(tpl.dataSource),
  )

  const handleDataSourceChange = (next: string) => {
    setDataSource(next)
    applySourceDefaults(
      next,
      { setType, setTitle, setIcon, setLink, setColSpan, setRowSpan },
      { fillTitle: !isEdit && !title.trim() },
    )
  }

  const applyTemplate = (source: DashboardDataSourceId) => {
    const d = defaultsFromDataSource(source)
    setTitle(d.title ?? '')
    setType(d.type ?? 'stat')
    setDataSource(d.dataSource ?? source)
    setColor(d.color ?? 'default')
    setColSpan(d.colSpan ?? 3)
    setRowSpan(d.rowSpan ?? 1)
    setIcon(d.icon ?? 'LayoutDashboard')
    setLink(d.link ?? '')
    setVisible(true)
  }

  useEffect(() => {
    if (!isEdit && isNew && card === null) {
      applySourceDefaults(dataSource, { setType, setTitle, setIcon, setLink, setColSpan, setRowSpan })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount for new cards
  }, [])

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[1.5rem] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">{isEdit ? 'Modifier la carte' : 'Nouvelle carte'}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        {isNew && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Modèles rapides</p>
            <div className="flex flex-wrap gap-2">
              {visibleTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => applyTemplate(tpl.dataSource)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#435933] hover:bg-[#f5faf5]"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>
        )}

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

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Source de données</label>
            <select
              value={dataSource}
              onChange={(e) => handleDataSourceChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#435933]"
            >
              {visibleCategories.map((cat) => (
                <optgroup key={cat.id} label={cat.label}>
                  {Object.values(DASHBOARD_DATA_SOURCE_REGISTRY)
                    .filter((m) => m.category === cat.id)
                    .map((m) => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                </optgroup>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-slate-400">Le type et le lien suggéré se mettent à jour automatiquement.</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Type d&apos;affichage</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as DashboardCardConfig['type'])}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#435933]"
            >
              {DASHBOARD_CARD_TYPES.map((value) => (
                <option key={value} value={value}>{CARD_TYPE_LABELS[value]}</option>
              ))}
            </select>
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
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Largeur: {colSpan}/12 col.
              </label>
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
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Hauteur: {rowSpan} rang{rowSpan > 1 ? 's' : ''}
              </label>
              <input
                type="range"
                min={1}
                max={4}
                value={rowSpan}
                onChange={(e) => setRowSpan(Number(e.target.value))}
                className="w-full accent-[#435933]"
              />
              <p className="mt-1 text-[11px] text-slate-400">≈ {rowSpan * 180}px par rang</p>
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
                {DASHBOARD_ICONS.map((k) => (
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
                placeholder="/admin/kyc"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#435933]"
              />
              <p className="mt-1 text-[11px] text-slate-400">Chemins /admin/… uniquement</p>
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
            <label htmlFor="visible" className="text-sm text-slate-700">Visible sur le tableau de bord</label>
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
