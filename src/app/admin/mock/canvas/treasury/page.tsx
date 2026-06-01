'use client';

import { useMemo, useState } from 'react';
import { Download, Wallet, TrendingUp, ArrowDownLeft, Clock, Check, X, ArrowUpRight } from 'lucide-react';
import { Avatar, StatusPill } from '../_components/primitives';
import DetailDrawer from '../_components/DetailDrawer';
import {
  transactions,
  fmtFCFA,
  fmtCompact,
  fmtDate,
  txTypeLabel,
  txStatusLabel,
  type MockTransaction,
  type TxType,
} from '../_data/mock';

const FILTERS: { key: TxType | 'all'; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'deposit', label: 'Dépôts' },
  { key: 'investment', label: 'Investissements' },
  { key: 'withdrawal', label: 'Retraits' },
];

export default function TreasuryPage() {
  const [filter, setFilter] = useState<TxType | 'all'>('all');
  const [selected, setSelected] = useState<MockTransaction | null>(null);

  const rows = useMemo(
    () => (filter === 'all' ? transactions : transactions.filter((t) => t.type === filter)),
    [filter],
  );

  const stats = [
    { label: 'Dépôts', value: transactions.filter((t) => t.type === 'deposit').reduce((s, t) => s + t.amount, 0), icon: Wallet, accent: '#435933' },
    { label: 'Investissements', value: transactions.filter((t) => t.type === 'investment').reduce((s, t) => s + t.amount, 0), icon: TrendingUp, accent: '#0284c7' },
    { label: 'Retraits', value: transactions.filter((t) => t.type === 'withdrawal').reduce((s, t) => s + t.amount, 0), icon: ArrowDownLeft, accent: '#C38D1C' },
    { label: 'En attente', value: transactions.filter((t) => t.status === 'pending').length, icon: Clock, accent: '#e11d48', count: true },
  ];

  return (
    <div>
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Flux financiers</p>
          <h1 className="mt-1 text-[2.25rem] font-bold leading-none tracking-tight">Trésorerie</h1>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#01081b] shadow-[0_8px_30px_-12px_rgba(1,8,27,0.18)] transition-all hover:shadow-[0_12px_36px_-12px_rgba(1,8,27,0.28)]">
          <Download size={16} /> Exporter
        </button>
      </header>

      {/* Stat tiles */}
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex flex-col justify-between rounded-[1.5rem] border border-white bg-white p-5 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.1)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{s.label}</span>
                <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: `${s.accent}14`, color: s.accent }}>
                  <Icon size={14} />
                </span>
              </div>
              <div className="mt-4 text-2xl font-bold tracking-tight tabular-nums">
                {s.count ? s.value : fmtCompact(s.value)}
                {!s.count && <span className="ml-1 text-sm font-medium text-slate-400">FCFA</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
          <h2 className="text-lg font-bold tracking-tight">Transactions</h2>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.key ? 'bg-[#01081b] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/60">
                {['Référence', 'Client', 'Type', 'Montant', 'Statut', 'Date'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 ${i === 3 ? 'text-right' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className={`group cursor-pointer border-b border-slate-50 transition-colors last:border-0 ${
                    selected?.id === t.id ? 'bg-[#f0f8f0]' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="px-6 py-3.5 font-mono text-xs text-slate-500 group-hover:text-[#435933]">{t.ref}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={t.user} size={30} />
                      <span className="text-sm font-medium">{t.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{txTypeLabel[t.type]}</span>
                  </td>
                  <td className="px-6 py-3.5 text-right text-sm font-bold tabular-nums">{fmtFCFA(t.amount)}</td>
                  <td className="px-6 py-3.5">
                    <StatusPill status={t.status} label={txStatusLabel[t.status]} />
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{fmtDate(t.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      <DetailDrawer open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-100 p-6 pt-7">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Transaction</p>
              <h2 className="mt-1 font-mono text-2xl font-bold tracking-tight">{selected.ref}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <div className="text-[2.5rem] font-bold leading-none tracking-tight tabular-nums">{fmtFCFA(selected.amount)}</div>
                <div className="mt-2 text-sm text-slate-400">FCFA</div>
              </div>

              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <Avatar name={selected.user} size={44} />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{selected.user}</div>
                  <div className="text-xs text-slate-500">{selected.email}</div>
                </div>
                <ArrowUpRight size={16} className="text-slate-400" />
              </div>

              <dl className="space-y-1">
                {[
                  ['Type', txTypeLabel[selected.type]],
                  ['Statut', txStatusLabel[selected.status]],
                  ['Méthode', selected.method],
                  ['Date', fmtDate(selected.date)],
                  ['Référence', selected.ref],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between border-b border-slate-50 py-3 last:border-0">
                    <dt className="text-sm text-slate-500">{k}</dt>
                    <dd className="text-sm font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {selected.status === 'pending' && (
              <div className="flex gap-3 border-t border-slate-100 p-6">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#435933] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#36482a]">
                  <Check size={16} /> Approuver
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50">
                  <X size={16} /> Rejeter
                </button>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
