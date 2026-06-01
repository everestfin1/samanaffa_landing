'use client'

import Link from 'next/link'
import {
  ArrowUpRight, Wallet, Users, ShieldCheck, Clock, CheckCircle2,
  TrendingUp, LayoutDashboard,
} from 'lucide-react'
import { Sparkline, Avatar } from '@/components/admin/layout/visuals'
import { fmtCompact, fmtFCFA, fmtDate } from '@/lib/admin/format'
import type { DashboardCardConfig } from '@/lib/admin/types'

const TX_TYPE_LABEL: Record<string, string> = {
  DEPOSIT: 'Dépôt',
  INVESTMENT: 'Investissement',
  WITHDRAWAL: 'Retrait',
}
const TX_STATUS_LABEL: Record<string, string> = {
  COMPLETED: 'Complété',
  PENDING: 'En attente',
  PROCESSING: 'En cours',
  FAILED: 'Échoué',
}

const COLOR_OPTIONS = [
  { value: 'default', label: 'Blanc', class: 'bg-white border-white text-slate-900' },
  { value: 'dark', label: 'Sombre', class: 'bg-[#01081b] text-white' },
  { value: 'green', label: 'Vert', class: 'bg-[#435933] text-white' },
  { value: 'gradient', label: 'Dégradé vert', class: 'bg-gradient-to-br from-[#4a6139] to-[#36482a] text-white' },
  { value: 'amber', label: 'Ambre', class: 'bg-amber-50 border-amber-200 text-amber-900' },
  { value: 'blue', label: 'Bleu', class: 'bg-blue-50 border-blue-200 text-blue-900' },
  { value: 'red', label: 'Rouge', class: 'bg-rose-50 border-rose-200 text-rose-900' },
]

const ICON_MAP: Record<string, React.ElementType> = {
  Wallet, Users, ShieldCheck, Clock, CheckCircle2, TrendingUp, ArrowUpRight, LayoutDashboard,
}

function resolveValue(stats: any, source: string) {
  if (source === 'aum') return stats.totalDeposits + stats.totalInvestments
  return stats[source] ?? 0
}

interface RenderContext {
  stats: any
  loading: boolean
  recent: any[]
  trend: number[]
}

export function renderCard(card: DashboardCardConfig, ctx: RenderContext) {
  const colorCls = COLOR_OPTIONS.find((c) => c.value === card.color)?.class ?? COLOR_OPTIONS[0].class
  const isDark = card.color === 'dark' || card.color === 'green' || card.color === 'gradient'
  const Icon = card.icon ? (ICON_MAP[card.icon] ?? LayoutDashboard) : LayoutDashboard

  // AUM chart: explicit dataSource='aum' OR type='chart' with aum source only
  if (card.dataSource === 'aum') {
    const aum = ctx.stats.totalDeposits + ctx.stats.totalInvestments
    return (
      <div className={`relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] p-7 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)] ${colorCls}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-white/70' : 'text-slate-500'}`}>
              <Icon size={16} className={isDark ? 'text-emerald-300' : 'text-[#435933]'} />
              {card.title}
            </div>
            <div className="mt-3 flex items-end gap-3">
              <span className={`text-[3.25rem] font-bold leading-none tracking-tighter tabular-nums ${isDark ? 'text-white' : 'text-[#01081b]'}`}>
                {ctx.loading ? '—' : fmtCompact(aum)}
              </span>
              <span className={`mb-1 text-xl font-medium ${isDark ? 'text-white/50' : 'text-slate-400'}`}>FCFA</span>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${isDark ? 'bg-white/10 text-white/70' : 'bg-slate-50 text-slate-500'}`}>
            {ctx.stats.completedTransactions} complétées
          </span>
        </div>
        {ctx.trend.length > 1 ? (
          <div className="mt-6 -mb-2">
            <Sparkline data={ctx.trend} width={680} height={88} />
          </div>
        ) : (
          <div className={`mt-6 h-[88px] rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`} />
        )}
      </div>
    )
  }

  if (card.type === 'link' || card.dataSource === 'kycAction') {
    return (
      <Link
        href={card.link || '/admin/kyc'}
        className={`group relative flex h-full items-center justify-between overflow-hidden rounded-[1.75rem] p-7 shadow-[0_12px_40px_-16px_rgba(67,89,51,0.6)] ${colorCls}`}
      >
        <div className="relative z-10">
          <div className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-white/70' : 'text-slate-500'}`}>
            <Icon size={16} /> {card.title}
          </div>
          <p className={`mt-2 text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {ctx.stats.pendingKyc + ctx.stats.underReviewKyc} dossiers
          </p>
          <p className={`mt-0.5 text-sm ${isDark ? 'text-white/70' : 'text-slate-500'}`}>
            {ctx.stats.pendingKyc} en attente · {ctx.stats.underReviewKyc} en révision
          </p>
        </div>
        <div className="relative z-10 grid h-12 w-12 place-items-center rounded-full bg-white/15 transition-transform group-hover:scale-110">
          <ArrowUpRight size={20} className={isDark ? 'text-white' : 'text-slate-700'} />
        </div>
        {isDark && <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />}
      </Link>
    )
  }

  if (card.type === 'list' || card.dataSource === 'recentActivity') {
    return (
      <div className={`flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)] ${colorCls}`}>
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{card.title}</h2>
          <Link href="/admin/transactions" className={`text-sm font-semibold hover:underline ${isDark ? 'text-emerald-300' : 'text-[#435933]'}`}>
            Tout voir
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
          {ctx.recent.length === 0 && (
            <p className={`py-8 text-center text-sm ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
              {ctx.loading ? 'Chargement…' : 'Aucune transaction.'}
            </p>
          )}
          {ctx.recent.map((t: any) => (
            <div key={t.id} className={`-mx-2 flex items-center justify-between rounded-xl px-2 py-2.5 transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
              <div className="flex items-center gap-3">
                <Avatar name={t.user?.name || t.user?.email || '?'} size={38} />
                <div className="min-w-0">
                  <div className={`truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.user?.name || t.user?.email || 'Client'}</div>
                  <div className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                    {TX_TYPE_LABEL[t.intentType] ?? t.intentType} · {fmtDate(t.createdAt)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>{fmtFCFA(Number(t.amount))}</div>
                <div className={`text-[11px] ${isDark ? 'text-white/50' : 'text-slate-400'}`}>{TX_STATUS_LABEL[t.status] ?? t.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (card.type === 'group' || card.dataSource === 'transactionBreakdown') {
    return (
      <div className="grid h-full grid-cols-2 gap-5">
        {[
          { label: 'En attente', value: ctx.stats.pendingTransactions, icon: Clock, color: 'text-[#C38D1C]' },
          { label: 'Complétées', value: ctx.stats.completedTransactions, icon: CheckCircle2, color: 'text-[#435933]' },
        ].map((s) => {
          const SIcon = s.icon
          return (
            <div key={s.label} className={`flex flex-col justify-between rounded-[1.5rem] p-5 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.1)] ${colorCls}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${isDark ? 'text-white/70' : 'text-slate-500'}`}>{s.label}</span>
                <SIcon size={15} className={s.color} />
              </div>
              <div className={`mt-3 text-2xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.value}</div>
              <span className={`text-[11px] ${isDark ? 'text-white/50' : 'text-slate-400'}`}>transactions</span>
            </div>
          )
        })}
      </div>
    )
  }

  // Default: stat card (covers type='stat' and type='chart' with non-aum sources)
  const value = resolveValue(ctx.stats, card.dataSource)
  const isMoney = card.dataSource === 'totalDeposits' || card.dataSource === 'totalInvestments'
  const formatted = isMoney ? fmtCompact(value) : String(value)
  const unit = isMoney ? 'FCFA' : ''

  return (
    <div className={`flex h-full flex-col justify-between rounded-[1.5rem] p-5 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.1)] ${colorCls}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${isDark ? 'text-white/70' : 'text-slate-500'}`}>{card.title}</span>
        <Icon size={15} className={isDark ? 'text-white/50' : 'text-slate-300'} />
      </div>
      <div className={`mt-4 text-2xl font-bold tracking-tight tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {formatted} {unit && <span className={`text-sm font-medium ${isDark ? 'text-white/50' : 'text-slate-400'}`}>{unit}</span>}
      </div>
    </div>
  )
}
