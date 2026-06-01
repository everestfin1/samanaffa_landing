'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { TrendingUp, Users, ArrowUpRight, Wallet, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react'
import { useAdminData } from '@/lib/admin/AdminDataProvider'
import { Sparkline, Avatar } from '@/components/admin/layout/visuals'
import { fmtCompact, fmtFCFA, fmtDate } from '@/lib/admin/format'

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

export default function OverviewPage() {
  const { stats, transactions, users, loading } = useAdminData()

  const aum = stats.totalDeposits + stats.totalInvestments

  const recent = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [transactions],
  )

  // Cumulative AUM trend from completed transactions (real data)
  const trend = useMemo(() => {
    const completed = [...transactions]
      .filter((t) => t.status === 'COMPLETED' && t.intentType !== 'WITHDRAWAL')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    if (completed.length < 2) return []
    let acc = 0
    return completed.map((t) => (acc += Number(t.amount) || 0))
  }, [transactions])

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Bonjour'
    if (h < 18) return 'Bon après-midi'
    return 'Bonsoir'
  })()

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {new Date().toLocaleDateString('fr-SN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="mt-1 text-[2.25rem] font-bold leading-none tracking-tight">{greeting}.</h1>
        </div>
        <Link
          href="/admin/transactions"
          className="group flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#01081b] shadow-[0_8px_30px_-12px_rgba(1,8,27,0.18)] transition-all hover:shadow-[0_12px_36px_-12px_rgba(1,8,27,0.28)]"
        >
          Voir les transactions
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </header>

      <div className="grid auto-rows-[minmax(150px,auto)] grid-cols-12 gap-5">
        {/* Hero AUM */}
        <section className="relative col-span-12 flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white bg-white p-7 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)] lg:col-span-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Wallet size={16} className="text-[#435933]" /> Flux confirmés (dépôts + investissements)
              </div>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-[3.25rem] font-bold leading-none tracking-tighter tabular-nums text-[#01081b]">
                  {loading ? '—' : fmtCompact(aum)}
                </span>
                <span className="mb-1 text-xl font-medium text-slate-400">FCFA</span>
              </div>
            </div>
            <Link href="/admin/transactions" className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100">
              {stats.completedTransactions} complétées
            </Link>
          </div>
          {trend.length > 1 ? (
            <div className="mt-6 -mb-2">
              <Sparkline data={trend} width={680} height={88} />
            </div>
          ) : (
            <div className="mt-6 h-[88px] rounded-xl bg-slate-50" />
          )}
        </section>

        {/* Dark stat: total users */}
        <section className="col-span-12 flex flex-col justify-between rounded-[1.75rem] bg-[#01081b] p-7 text-white shadow-lg sm:col-span-6 lg:col-span-4">
          <div className="flex items-center justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/10">
              <Users size={20} />
            </div>
            <Link href="/admin/users" className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-white/20">
              Gérer
            </Link>
          </div>
          <div className="mt-8">
            <p className="text-sm font-medium text-slate-400">Clients enregistrés</p>
            <p className="mt-1 text-[2.5rem] font-bold leading-none tracking-tight tabular-nums">
              {loading ? '—' : fmtFCFA(stats.totalUsers)}
            </p>
          </div>
        </section>

        {/* Recent activity */}
        <section className="col-span-12 rounded-[1.75rem] border border-white bg-white p-7 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)] lg:col-span-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Activité récente</h2>
            <Link href="/admin/transactions" className="text-sm font-semibold text-[#435933] hover:underline">
              Tout voir
            </Link>
          </div>
          <div className="flex flex-col">
            {recent.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">{loading ? 'Chargement…' : 'Aucune transaction.'}</p>
            )}
            {recent.map((t) => (
              <div key={t.id} className="-mx-2 flex items-center justify-between rounded-xl px-2 py-2.5 transition-colors hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <Avatar name={t.user?.name || t.user?.email || '?'} size={38} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{t.user?.name || t.user?.email || 'Client'}</div>
                    <div className="text-xs text-slate-500">
                      {TX_TYPE_LABEL[t.intentType] ?? t.intentType} · {fmtDate(t.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold tabular-nums">{fmtFCFA(Number(t.amount))}</div>
                  <div className="text-[11px] text-slate-400">{TX_STATUS_LABEL[t.status] ?? t.status}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right column: KYC action + breakdown */}
        <div className="col-span-12 grid grid-rows-2 gap-5 lg:col-span-6">
          <Link
            href="/admin/kyc"
            className="group relative flex items-center justify-between overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#4a6139] to-[#36482a] p-7 text-white shadow-[0_12px_40px_-16px_rgba(67,89,51,0.6)]"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                <ShieldCheck size={16} /> Vérification KYC
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight">{stats.pendingKyc + stats.underReviewKyc} dossiers</p>
              <p className="mt-0.5 text-sm text-white/70">
                {stats.pendingKyc} en attente · {stats.underReviewKyc} en révision
              </p>
            </div>
            <div className="relative z-10 grid h-12 w-12 place-items-center rounded-full bg-white/15 transition-transform group-hover:scale-110">
              <ArrowUpRight size={20} />
            </div>
            <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          </Link>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col justify-between rounded-[1.5rem] border border-white bg-white p-5 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.1)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">En attente</span>
                <Clock size={15} className="text-[#C38D1C]" />
              </div>
              <div className="mt-3 text-2xl font-bold tabular-nums">{stats.pendingTransactions}</div>
              <span className="text-[11px] text-slate-400">transactions</span>
            </div>
            <div className="flex flex-col justify-between rounded-[1.5rem] border border-white bg-white p-5 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.1)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Complétées</span>
                <CheckCircle2 size={15} className="text-[#435933]" />
              </div>
              <div className="mt-3 text-2xl font-bold tabular-nums">{stats.completedTransactions}</div>
              <span className="text-[11px] text-slate-400">transactions</span>
            </div>
          </div>
        </div>

        {/* Bottom metric strip */}
        {[
          { label: 'Dépôts confirmés', value: fmtCompact(stats.totalDeposits), unit: 'FCFA', icon: Wallet },
          { label: 'Investissements', value: fmtCompact(stats.totalInvestments), unit: 'FCFA', icon: TrendingUp },
          { label: 'KYC en attente', value: String(stats.pendingKyc), unit: '', icon: ShieldCheck },
          { label: 'Clients', value: fmtFCFA(stats.totalUsers), unit: '', icon: Users },
        ].map((m) => {
          const Icon = m.icon
          return (
            <div key={m.label} className="col-span-6 flex flex-col justify-between rounded-[1.5rem] border border-white bg-white p-5 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.1)] lg:col-span-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{m.label}</span>
                <Icon size={15} className="text-slate-300" />
              </div>
              <div className="mt-4 text-2xl font-bold tracking-tight tabular-nums">
                {m.value} {m.unit && <span className="text-sm font-medium text-slate-400">{m.unit}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
