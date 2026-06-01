'use client';

import Link from 'next/link';
import { TrendingUp, Users, ArrowUpRight, ArrowRight, Wallet, ShieldCheck, Clock } from 'lucide-react';
import { Sparkline, Avatar } from './_components/primitives';
import {
  metrics,
  aumTrend,
  transactions,
  fmtCompact,
  fmtFCFA,
  txTypeLabel,
  txStatusLabel,
} from './_data/mock';

export default function CanvasOverview() {
  const recent = transactions.slice(0, 5);
  return (
    <div>
      {/* Header */}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Mercredi 28 mai 2026</p>
          <h1 className="mt-1 text-[2.25rem] font-bold leading-none tracking-tight">Bonjour, Aliou.</h1>
        </div>
        <Link
          href="/admin/mock/canvas/treasury"
          className="group flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#01081b] shadow-[0_8px_30px_-12px_rgba(1,8,27,0.18)] transition-all hover:shadow-[0_12px_36px_-12px_rgba(1,8,27,0.28)]"
        >
          Voir la trésorerie
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </header>

      {/* Bento grid */}
      <div className="grid auto-rows-[minmax(150px,auto)] grid-cols-12 gap-5">
        {/* Hero AUM */}
        <section className="relative col-span-12 flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white bg-white p-7 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)] lg:col-span-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Wallet size={16} className="text-[#435933]" /> Actifs sous gestion
              </div>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-[3.25rem] font-bold leading-none tracking-tighter tabular-nums text-[#01081b]">
                  {fmtCompact(metrics.aum)}
                </span>
                <span className="mb-1 text-xl font-medium text-slate-400">FCFA</span>
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-[#e8f5e8] px-3 py-1 text-xs font-bold text-[#2f5233]">
              <TrendingUp size={13} /> +14,2%
            </span>
          </div>
          <div className="mt-6 -mb-2">
            <Sparkline data={aumTrend} width={680} height={88} />
          </div>
        </section>

        {/* Dark stat: new users */}
        <section className="col-span-12 flex flex-col justify-between rounded-[1.75rem] bg-[#01081b] p-7 text-white shadow-lg sm:col-span-6 lg:col-span-4">
          <div className="flex items-center justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/10">
              <Users size={20} />
            </div>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">+12 aujourd'hui</span>
          </div>
          <div className="mt-8">
            <p className="text-sm font-medium text-slate-400">Nouveaux clients (30j)</p>
            <p className="mt-1 text-[2.5rem] font-bold leading-none tracking-tight tabular-nums">{metrics.newUsers}</p>
          </div>
        </section>

        {/* Recent deposits */}
        <section className="col-span-12 rounded-[1.75rem] border border-white bg-white p-7 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)] lg:col-span-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Activité récente</h2>
            <Link href="/admin/mock/canvas/treasury" className="text-sm font-semibold text-[#435933] hover:underline">
              Tout voir
            </Link>
          </div>
          <div className="flex flex-col">
            {recent.map((t) => (
              <div key={t.id} className="-mx-2 flex items-center justify-between rounded-xl px-2 py-2.5 transition-colors hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <Avatar name={t.user} size={38} />
                  <div>
                    <div className="text-sm font-semibold">{t.user}</div>
                    <div className="text-xs text-slate-500">{txTypeLabel[t.type]} · {t.method}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold tabular-nums">{fmtFCFA(t.amount)}</div>
                  <div className="text-[11px] text-slate-400">{txStatusLabel[t.status]}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right column: action + health */}
        <div className="col-span-12 grid grid-rows-2 gap-5 lg:col-span-6">
          <Link
            href="/admin/mock/canvas/control"
            className="group relative flex items-center justify-between overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#4a6139] to-[#36482a] p-7 text-white shadow-[0_12px_40px_-16px_rgba(67,89,51,0.6)]"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                <ShieldCheck size={16} /> File de contrôle
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight">{metrics.pendingKyc} dossiers KYC</p>
              <p className="mt-0.5 text-sm text-white/70">en attente de révision</p>
            </div>
            <div className="relative z-10 grid h-12 w-12 place-items-center rounded-full bg-white/15 transition-transform group-hover:scale-110">
              <ArrowUpRight size={20} />
            </div>
            <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          </Link>

          <div className="flex flex-col justify-center rounded-[1.75rem] border border-white bg-white p-7 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold tracking-tight">Santé de la plateforme</h3>
              <span className="flex items-center gap-1.5 text-sm font-bold text-[#435933]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#435933]" /> Opérationnel
              </span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Disponibilité API', value: 99.8 },
                { label: 'Paiements traités', value: 96 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-500">{row.label}</span>
                    <span className="font-semibold tabular-nums">{row.value}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-[#435933]" style={{ width: `${row.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom metric strip */}
        {[
          { label: 'Dépôts (mois)', value: fmtCompact(metrics.deposits), unit: 'FCFA', icon: Wallet },
          { label: 'Investissements', value: fmtCompact(metrics.investments), unit: 'FCFA', icon: TrendingUp },
          { label: 'Transactions en attente', value: String(metrics.pendingTx), unit: '', icon: Clock },
          { label: 'Clients totaux', value: fmtFCFA(metrics.totalUsers), unit: '', icon: Users },
        ].map((m) => {
          const Icon = m.icon;
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
          );
        })}
      </div>
    </div>
  );
}
