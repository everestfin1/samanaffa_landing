'use client';

import { useState } from 'react';
import { AlertCircle, Check, X, FileText, IdCard, ZoomIn, Sparkles } from 'lucide-react';
import { Avatar } from '../_components/primitives';
import { kycQueue, fmtDate } from '../_data/mock';

export default function ControlPage() {
  const [activeId, setActiveId] = useState(kycQueue[0]?.id ?? '');
  const [resolved, setResolved] = useState<Record<string, 'approved' | 'rejected'>>({});

  const active = kycQueue.find((k) => k.id === activeId) ?? null;
  const pendingCount = kycQueue.filter((k) => !resolved[k.id]).length;

  function resolve(id: string, decision: 'approved' | 'rejected') {
    setResolved((r) => ({ ...r, [id]: decision }));
    const next = kycQueue.find((k) => k.id !== id && !resolved[k.id]);
    if (next) setActiveId(next.id);
  }

  return (
    <div>
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{pendingCount} dossiers en attente</p>
          <h1 className="mt-1 text-[2.25rem] font-bold leading-none tracking-tight">Contrôle KYC</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-[0_8px_30px_-12px_rgba(1,8,27,0.18)]">
          <Sparkles size={15} className="text-[#C38D1C]" />
          <span className="font-medium text-slate-600">Tri assisté par IA</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-5">
        {/* Queue */}
        <div className="col-span-12 lg:col-span-4">
          <div className="overflow-hidden rounded-[1.5rem] border border-white bg-white shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)]">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">File d'attente</h2>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {kycQueue.map((k) => {
                const decision = resolved[k.id];
                return (
                  <button
                    key={k.id}
                    onClick={() => setActiveId(k.id)}
                    className={`relative flex w-full items-center gap-3 border-b border-slate-50 px-5 py-4 text-left transition-colors last:border-0 ${
                      activeId === k.id ? 'bg-[#f0f8f0]' : 'hover:bg-slate-50'
                    } ${decision ? 'opacity-50' : ''}`}
                  >
                    {activeId === k.id && <span className="absolute left-0 top-0 h-full w-1 bg-[#435933]" />}
                    <Avatar name={k.user} size={38} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold">{k.user}</span>
                        <span className="shrink-0 text-[10px] text-slate-400">{fmtDate(k.submitted)}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="truncate text-xs text-slate-500">{k.docType}</span>
                        {decision ? (
                          <span className={`shrink-0 text-[10px] font-bold uppercase ${decision === 'approved' ? 'text-[#435933]' : 'text-rose-500'}`}>
                            {decision === 'approved' ? 'Approuvé' : 'Rejeté'}
                          </span>
                        ) : (
                          k.priority === 'urgent' && (
                            <span className="flex shrink-0 items-center gap-0.5 text-[10px] font-bold uppercase text-rose-500">
                              <AlertCircle size={11} /> Urgent
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail / review workspace */}
        <div className="col-span-12 lg:col-span-8">
          {active ? (
            <div className="rounded-[1.75rem] border border-white bg-white p-7 shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar name={active.user} size={56} />
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">{active.user}</h2>
                    <p className="font-mono text-sm text-slate-500">{active.idNumber}</p>
                  </div>
                </div>
                {resolved[active.id] ? (
                  <span className={`rounded-full px-4 py-2 text-sm font-bold ${resolved[active.id] === 'approved' ? 'bg-[#e8f5e8] text-[#2f5233]' : 'bg-rose-50 text-rose-600'}`}>
                    {resolved[active.id] === 'approved' ? 'Dossier approuvé' : 'Dossier rejeté'}
                  </span>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => resolve(active.id, 'rejected')}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      <X size={16} /> Rejeter
                    </button>
                    <button
                      onClick={() => resolve(active.id, 'approved')}
                      className="flex items-center gap-2 rounded-xl bg-[#435933] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(67,89,51,0.6)] transition-colors hover:bg-[#36482a]"
                    >
                      <Check size={16} /> Approuver
                    </button>
                  </div>
                )}
              </div>

              {/* AI insight */}
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#e8f5e8] bg-[#f5faf5] p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#e8f5e8] text-[#435933]">
                  <Sparkles size={15} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#2f5233]">Vérification automatique réussie</p>
                  <p className="mt-0.5 text-xs text-slate-500">Le visage correspond à la pièce (98%). Aucune anomalie détectée sur le document.</p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-7 md:grid-cols-2">
                {/* Extracted info */}
                <div>
                  <h3 className="mb-3 border-b border-slate-100 pb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Informations extraites
                  </h3>
                  <dl className="space-y-3">
                    {[
                      ['Nom complet', active.user],
                      ['Date de naissance', active.dob],
                      ['Type de document', active.docType],
                      ["Numéro de pièce", active.idNumber],
                      ['Soumis le', fmtDate(active.submitted)],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs text-slate-400">{k}</dt>
                        <dd className="text-sm font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="mb-3 border-b border-slate-100 pb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Documents fournis
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Pièce d\u2019identité (Recto)', icon: IdCard },
                      { label: 'Pièce d\u2019identité (Verso)', icon: IdCard },
                      { label: 'Selfie de vérification', icon: FileText },
                    ].map((doc) => {
                      const Icon = doc.icon;
                      return (
                        <div
                          key={doc.label}
                          className="group flex aspect-[16/7] items-center justify-between overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 px-4"
                        >
                          <div className="flex items-center gap-3 text-slate-500">
                            <Icon size={20} />
                            <span className="text-sm font-medium">{doc.label}</span>
                          </div>
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-slate-400 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                            <ZoomIn size={15} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid h-full place-items-center rounded-[1.75rem] border border-white bg-white p-12 text-center shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)]">
              <div>
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#e8f5e8] text-[#435933]">
                  <Check size={26} />
                </div>
                <h3 className="text-lg font-bold">File vide</h3>
                <p className="mt-1 text-sm text-slate-500">Tous les dossiers ont été traités.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
