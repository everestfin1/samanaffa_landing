'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Pencil, Trash2, Plus, Save, ChevronUp, ChevronDown, LayoutDashboard, X, Eye, EyeOff, RefreshCw,
} from 'lucide-react'
import { useAdminData } from '@/lib/admin/AdminDataProvider'
import type { DashboardCardConfig } from '@/lib/admin/types'
import { renderCard, type RenderContext } from './CardRenderers'
import CardEditorModal from './CardEditorModal'
import { colSpanClass, dashboardGridRowStyle, rowSpanClass } from './gridUtils'

export default function EditableDashboard() {
  const {
    stats,
    transactions,
    kycDocuments,
    apeSubscriptions,
    apeStats,
    peeLeads,
    peeLeadStats,
    sponsorCodeStats,
    loading,
    dashboardCards,
    refreshDashboardCards,
    refresh,
    authedFetch,
  } = useAdminData()

  const [editMode, setEditMode] = useState(false)
  const [editingCard, setEditingCard] = useState<DashboardCardConfig | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [recalculating, setRecalculating] = useState(false)
  const [recalculateMessage, setRecalculateMessage] = useState<string | null>(null)

  const visibleCards = useMemo(
    () => [...dashboardCards].filter((c) => c.visible).sort((a, b) => a.order - b.order),
    [dashboardCards],
  )

  const hiddenCards = useMemo(
    () => [...dashboardCards].filter((c) => !c.visible).sort((a, b) => a.order - b.order),
    [dashboardCards],
  )

  const nextCardOrder = useMemo(
    () => (dashboardCards.length === 0 ? 0 : Math.max(...dashboardCards.map((c) => c.order)) + 1),
    [dashboardCards],
  )

  const recent = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [transactions],
  )

  const trend = useMemo(() => {
    const completed = [...transactions]
      .filter((t) => t.status === 'COMPLETED' && t.intentType !== 'WITHDRAWAL')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    if (completed.length < 2) return []
    let acc = 0
    return completed.map((t) => (acc += Number(t.amount) || 0))
  }, [transactions])

  const kycQueue = useMemo(
    () =>
      [...kycDocuments]
        .filter((d) => d.verificationStatus === 'PENDING' || d.verificationStatus === 'UNDER_REVIEW')
        .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
        .slice(0, 5),
    [kycDocuments],
  )

  const recentApe = useMemo(
    () =>
      [...apeSubscriptions]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [apeSubscriptions],
  )

  const recentPee = useMemo(
    () =>
      [...peeLeads]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [peeLeads],
  )

  const ctx: RenderContext = {
    stats,
    apeStats,
    peeLeadStats,
    sponsorCodeStats,
    loading,
    recent,
    kycQueue,
    recentApe,
    recentPee,
    trend,
  }

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Bonjour'
    if (h < 18) return 'Bon après-midi'
    return 'Bonsoir'
  })()

  const handleReorder = useCallback(
    async (id: string, direction: 'up' | 'down') => {
      const idx = visibleCards.findIndex((c) => c.id === id)
      if (idx === -1) return
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= visibleCards.length) return
      const next = [...visibleCards]
      const temp = next[idx].order
      next[idx].order = next[swapIdx].order
      next[swapIdx].order = temp
      setSaving(true)
      setSaveError(null)
      try {
        const res = await authedFetch('/api/admin/dashboard-config', {
          method: 'PUT',
          body: JSON.stringify({
            cards: next.map((c) => ({
              id: c.id,
              order: c.order,
              colSpan: c.colSpan,
              rowSpan: c.rowSpan ?? 1,
            })),
          }),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.error || 'Erreur de sauvegarde')
        await refreshDashboardCards()
      } catch (e: unknown) {
        setSaveError(e instanceof Error ? e.message : 'Erreur de sauvegarde')
      } finally {
        setSaving(false)
      }
    },
    [visibleCards, authedFetch, refreshDashboardCards],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Supprimer cette carte ?')) return
      setSaving(true)
      setSaveError(null)
      try {
        const res = await authedFetch(`/api/admin/dashboard-config?id=${id}`, { method: 'DELETE' })
        const data = await res.json()
        if (!data.success) throw new Error(data.error || 'Erreur de suppression')
        await refreshDashboardCards()
      } catch (e: unknown) {
        setSaveError(e instanceof Error ? e.message : 'Erreur de suppression')
      } finally {
        setSaving(false)
      }
    },
    [authedFetch, refreshDashboardCards],
  )

  const handleSaveCard = useCallback(
    async (card: Partial<DashboardCardConfig>) => {
      setSaving(true)
      setSaveError(null)
      try {
        const res = await authedFetch('/api/admin/dashboard-config', {
          method: card.id ? 'PUT' : 'POST',
          body: JSON.stringify(
            card.id ? card : { ...card, order: nextCardOrder },
          ),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.error || 'Erreur de sauvegarde')
        await refreshDashboardCards()
        setEditingCard(null)
        setShowAdd(false)
      } catch (e: unknown) {
        setSaveError(e instanceof Error ? e.message : 'Erreur de sauvegarde')
      } finally {
        setSaving(false)
      }
    },
    [authedFetch, refreshDashboardCards, nextCardOrder],
  )

  const handleRestoreVisibility = useCallback(
    async (card: DashboardCardConfig) => {
      setSaving(true)
      setSaveError(null)
      try {
        const res = await authedFetch('/api/admin/dashboard-config', {
          method: 'PUT',
          body: JSON.stringify({ id: card.id, visible: true }),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.error || 'Erreur de restauration')
        await refreshDashboardCards()
      } catch (e: unknown) {
        setSaveError(e instanceof Error ? e.message : 'Erreur de restauration')
      } finally {
        setSaving(false)
      }
    },
    [authedFetch, refreshDashboardCards],
  )

  const handleRecalculateBalances = useCallback(async () => {
    if (!confirm('Recalculer tous les soldes à partir des transactions complétées ?')) return
    setRecalculating(true)
    setRecalculateMessage(null)
    try {
      const res = await authedFetch('/api/admin/accounts/recalculate-balances', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Échec du recalcul')
      const changed = Array.isArray(data.results)
        ? data.results.filter((r: { difference: number }) => r.difference !== 0).length
        : 0
      setRecalculateMessage(
        changed > 0
          ? `${changed} compte(s) mis à jour.`
          : 'Recalcul terminé — aucun écart détecté.',
      )
      await refresh()
    } catch (e: unknown) {
      setRecalculateMessage(e instanceof Error ? e.message : 'Erreur lors du recalcul')
    } finally {
      setRecalculating(false)
    }
  }, [authedFetch, refresh])

  const renderCardShell = (card: DashboardCardConfig, idx: number, opts: { dimmed?: boolean }) => {
    const rowSpan = card.rowSpan ?? 1
    const rowLayout = dashboardGridRowStyle(rowSpan)
    return (
    <div
      key={card.id}
      className={`relative col-span-12 ${colSpanClass(card.colSpan)} ${rowSpanClass(rowSpan)} flex min-h-0 flex-col group ${opts.dimmed ? 'opacity-60' : ''}`}
      style={rowLayout}
    >
      <div className="min-h-0 flex-1">{renderCard(card, ctx)}</div>

      {editMode && (
        <div className="absolute inset-0 z-20 flex items-start justify-end gap-1 rounded-[1.75rem] bg-[#01081b]/5 p-3 opacity-0 transition-opacity group-hover:opacity-100">
          {!opts.dimmed && (
            <>
              <button
                type="button"
                onClick={() => handleReorder(card.id, 'up')}
                disabled={idx === 0 || saving}
                className="rounded-full bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-30"
                title="Monter"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleReorder(card.id, 'down')}
                disabled={idx === visibleCards.length - 1 || saving}
                className="rounded-full bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-30"
                title="Descendre"
              >
                <ChevronDown size={14} />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setEditingCard(card)}
            disabled={saving}
            className="rounded-full bg-white p-2 text-[#435933] shadow-sm hover:bg-[#f5faf5] disabled:opacity-30"
            title="Modifier"
          >
            <Pencil size={14} />
          </button>
          {opts.dimmed ? (
            <button
              type="button"
              onClick={() => handleRestoreVisibility(card)}
              disabled={saving}
              className="rounded-full bg-white p-2 text-[#435933] shadow-sm hover:bg-[#f5faf5] disabled:opacity-30"
              title="Afficher"
            >
              <Eye size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleDelete(card.id)}
              disabled={saving}
              className="rounded-full bg-white p-2 text-rose-500 shadow-sm hover:bg-rose-50 disabled:opacity-30"
              title="Supprimer"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
    )
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {new Date().toLocaleDateString('fr-SN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="mt-1 text-[2.25rem] font-bold leading-none tracking-tight">{greeting}.</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRecalculateBalances}
            disabled={recalculating || saving}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_8px_30px_-12px_rgba(1,8,27,0.18)] transition-all hover:shadow-[0_12px_36px_-12px_rgba(1,8,27,0.28)] disabled:opacity-50"
            title="Recalculer les soldes"
          >
            <RefreshCw size={16} className={recalculating ? 'animate-spin' : ''} />
            {recalculating ? 'Recalcul…' : 'Soldes'}
          </button>
          <button
            type="button"
            onClick={() => setEditMode((v) => !v)}
            disabled={saving}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-[0_8px_30px_-12px_rgba(1,8,27,0.18)] transition-all disabled:opacity-50 ${
              editMode ? 'bg-[#01081b] text-white' : 'bg-white text-[#01081b] hover:shadow-[0_12px_36px_-12px_rgba(1,8,27,0.28)]'
            }`}
          >
            {editMode ? <Save size={16} /> : <Pencil size={16} />}
            {editMode ? 'Terminer' : 'Personnaliser'}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={() => { setEditingCard(null); setShowAdd(true) }}
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-[#435933] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(67,89,51,0.6)] transition-all hover:bg-[#36482a] disabled:opacity-50"
            >
              <Plus size={16} />
              Ajouter
            </button>
          )}
        </div>
      </header>

      {editMode && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800">
          Mode édition actif. Cliquez sur <Pencil size={14} className="inline mx-1" /> pour modifier,
          <ChevronUp size={14} className="inline mx-1" /> <ChevronDown size={14} className="inline mx-1" /> pour réorganiser,
          et <Trash2 size={14} className="inline mx-1" /> pour supprimer.
          {hiddenCards.length > 0 && (
            <> Les cartes masquées apparaissent en bas — utilisez <Eye size={14} className="inline mx-1" /> pour les réafficher.</>
          )}
        </div>
      )}

      {recalculateMessage && (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm text-emerald-800">
          {recalculateMessage}
        </div>
      )}

      {saveError && (
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-800">
          <span>{saveError}</span>
          <button type="button" onClick={() => setSaveError(null)} className="ml-3 text-rose-400 hover:text-rose-600">
            <X size={16} />
          </button>
        </div>
      )}

      {loading && visibleCards.length === 0 && hiddenCards.length === 0 ? (
        <div className="grid grid-cols-12 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="col-span-12 lg:col-span-3 h-32 animate-pulse rounded-[1.5rem] bg-slate-100" />
          ))}
        </div>
      ) : visibleCards.length === 0 && hiddenCards.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-300">
            <LayoutDashboard size={24} />
          </div>
          <p className="text-lg font-bold text-slate-700">Aucune carte configurée</p>
          <p className="mt-1 text-sm text-slate-400">Activez le mode édition pour ajouter des widgets.</p>
          <button
            type="button"
            onClick={() => { setEditMode(true); setShowAdd(true) }}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#435933] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(67,89,51,0.6)]"
          >
            <Plus size={16} /> Ajouter une carte
          </button>
        </div>
      ) : (
        <>
          {visibleCards.length > 0 && (
            <div className="grid auto-rows-[180px] grid-cols-12 gap-5">
              {visibleCards.map((card, idx) => renderCardShell(card, idx, {}))}
            </div>
          )}

          {editMode && hiddenCards.length > 0 && (
            <section className="mt-10">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-500">
                <EyeOff size={16} />
                Cartes masquées ({hiddenCards.length})
              </div>
              <div className="grid auto-rows-[180px] grid-cols-12 gap-5">
                {hiddenCards.map((card, idx) => renderCardShell(card, idx, { dimmed: true }))}
              </div>
            </section>
          )}

          {visibleCards.length === 0 && hiddenCards.length > 0 && !editMode && (
            <div className="py-12 text-center text-sm text-slate-500">
              Toutes les cartes sont masquées. Activez le mode édition pour les réafficher.
            </div>
          )}
        </>
      )}

      {(showAdd || editingCard) && (
        <CardEditorModal
          key={editingCard?.id ?? `new-${showAdd}`}
          card={editingCard}
          isNew={showAdd && !editingCard}
          onClose={() => { setShowAdd(false); setEditingCard(null) }}
          onSave={handleSaveCard}
          saving={saving}
        />
      )}
    </div>
  )
}
