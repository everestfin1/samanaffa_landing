'use client';

import { useMemo, useState } from 'react';
import { Mail, Phone, Wallet, CalendarDays, UserPlus, Crown } from 'lucide-react';
import { Avatar, StatusPill } from '../_components/primitives';
import DetailDrawer from '../_components/DetailDrawer';
import { users, fmtFCFA, fmtDate, kycStatusLabel, type MockUser, type KycStatus } from '../_data/mock';

const FILTERS: { key: KycStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'approved', label: 'Vérifiés' },
  { key: 'under_review', label: 'En révision' },
  { key: 'pending', label: 'En attente' },
  { key: 'rejected', label: 'Rejetés' },
];

const TIER_STYLE: Record<MockUser['tier'], string> = {
  Standard: 'bg-slate-100 text-slate-500',
  Premium: 'bg-[#e0f2fe] text-[#075985]',
  VIP: 'bg-[#fdf0d5] text-[#92400e]',
};

export default function ClientsPage() {
  const [filter, setFilter] = useState<KycStatus | 'all'>('all');
  const [selected, setSelected] = useState<MockUser | null>(null);

  const rows = useMemo(() => (filter === 'all' ? users : users.filter((u) => u.kyc === filter)), [filter]);

  return (
    <div>
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{users.length} clients actifs</p>
          <h1 className="mt-1 text-[2.25rem] font-bold leading-none tracking-tight">Clients</h1>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-[#435933] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_-12px_rgba(67,89,51,0.6)] transition-all hover:bg-[#36482a]">
          <UserPlus size={16} /> Inviter
        </button>
      </header>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === f.key ? 'bg-[#01081b] text-white' : 'bg-white text-slate-600 shadow-sm hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelected(u)}
            className="group flex flex-col rounded-[1.5rem] border border-white bg-white p-5 text-left shadow-[0_8px_30px_-16px_rgba(1,8,27,0.1)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-18px_rgba(1,8,27,0.22)]"
          >
            <div className="flex items-start justify-between">
              <Avatar name={`${u.firstName} ${u.lastName}`} size={48} />
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${TIER_STYLE[u.tier]}`}>
                {u.tier === 'VIP' && <Crown size={11} />}
                {u.tier}
              </span>
            </div>
            <div className="mt-3">
              <div className="font-semibold tracking-tight">{u.firstName} {u.lastName}</div>
              <div className="truncate text-xs text-slate-500">{u.email}</div>
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-slate-50 pt-4">
              <div>
                <div className="text-[11px] text-slate-400">Solde</div>
                <div className="text-base font-bold tabular-nums">{fmtFCFA(u.balance)}</div>
              </div>
              <StatusPill status={u.kyc} label={kycStatusLabel[u.kyc]} />
            </div>
          </button>
        ))}
      </div>

      <DetailDrawer open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="flex h-full flex-col">
            <div className="flex flex-col items-center border-b border-slate-100 p-8 pt-10 text-center">
              <Avatar name={`${selected.firstName} ${selected.lastName}`} size={72} />
              <h2 className="mt-4 text-xl font-bold tracking-tight">{selected.firstName} {selected.lastName}</h2>
              <div className="mt-2 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${TIER_STYLE[selected.tier]}`}>
                  {selected.tier === 'VIP' && <Crown size={11} />} {selected.tier}
                </span>
                <StatusPill status={selected.kyc} label={kycStatusLabel[selected.kyc]} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-[11px] text-slate-400">Solde total</div>
                  <div className="mt-1 text-lg font-bold tabular-nums">{fmtFCFA(selected.balance)}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-[11px] text-slate-400">Transactions</div>
                  <div className="mt-1 text-lg font-bold tabular-nums">{selected.transactions}</div>
                </div>
              </div>

              <dl className="space-y-1">
                {[
                  [<Mail key="m" size={15} />, 'Email', selected.email],
                  [<Phone key="p" size={15} />, 'Téléphone', selected.phone],
                  [<Wallet key="w" size={15} />, 'Niveau', selected.tier],
                  [<CalendarDays key="c" size={15} />, 'Inscrit le', fmtDate(selected.joined)],
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3 border-b border-slate-50 py-3 last:border-0">
                    <span className="text-slate-400">{row[0]}</span>
                    <span className="flex-1 text-sm text-slate-500">{row[1]}</span>
                    <span className="text-sm font-medium">{row[2]}</span>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex gap-3 border-t border-slate-100 p-6">
              <button className="flex-1 rounded-xl bg-[#435933] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#36482a]">
                Voir le profil
              </button>
              <button className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                Message
              </button>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
