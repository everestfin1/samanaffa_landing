'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Landmark,
  Users,
  ShieldCheck,
  Search,
  Bell,
  Command,
  CornerDownLeft,
  ArrowRight,
} from 'lucide-react';

const NAV = [
  { href: '/admin/mock/canvas', label: 'Aperçu', icon: LayoutDashboard },
  { href: '/admin/mock/canvas/treasury', label: 'Trésorerie', icon: Landmark },
  { href: '/admin/mock/canvas/clients', label: 'Clients', icon: Users },
  { href: '/admin/mock/canvas/control', label: 'Contrôle', icon: ShieldCheck },
];

const COMMANDS = [
  ...NAV.map((n) => ({ ...n, group: 'Navigation' as const })),
  { href: '/admin/mock/canvas/treasury', label: 'Approuver un retrait', icon: Landmark, group: 'Actions' as const },
  { href: '/admin/mock/canvas/control', label: 'Réviser un dossier KYC', icon: ShieldCheck, group: 'Actions' as const },
  { href: '/admin/mock/canvas/clients', label: 'Rechercher un client', icon: Users, group: 'Actions' as const },
];

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return COMMANDS;
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(term));
  }, [q]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  useEffect(() => {
    if (!open) setQ('');
  }, [open]);

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const sel = results[active];
      if (sel) {
        router.push(sel.href);
        onClose();
      }
    }
  }

  if (!open) return null;

  let lastGroup = '';

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#01081b]/30 backdrop-blur-sm animate-[fadeIn_120ms_ease-out]" />
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200/80 shadow-[0_24px_60px_-12px_rgba(1,8,27,0.28)] overflow-hidden animate-[popIn_140ms_cubic-bezier(0.22,1,0.36,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-slate-100">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Rechercher une page, une action, un client…"
            className="flex-1 py-4 text-[15px] outline-none placeholder:text-slate-400 bg-transparent"
          />
          <kbd className="text-[10px] font-semibold text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="max-h-[320px] overflow-y-auto p-2">
          {results.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-slate-400">Aucun résultat pour « {q} ».</div>
          )}
          {results.map((c, i) => {
            const showGroup = c.group !== lastGroup;
            lastGroup = c.group;
            const Icon = c.icon;
            return (
              <div key={`${c.label}-${i}`}>
                {showGroup && (
                  <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{c.group}</div>
                )}
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => {
                    router.push(c.href);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    active === i ? 'bg-[#f0f8f0]' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${active === i ? 'bg-[#e8f5e8] text-[#435933]' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon size={16} />
                  </span>
                  <span className="flex-1 text-sm font-medium text-[#01081b]">{c.label}</span>
                  {active === i && <CornerDownLeft size={14} className="text-slate-400" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CanvasShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === 'Escape') setPaletteOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-screen bg-[#eef0f3] text-[#01081b] font-sans antialiased pb-28">
      {/* Floating brand (top-left, same level as nav) */}
      <Link
        href="/admin/mock/canvas"
        className="fixed top-5 left-5 z-50 flex items-center rounded-full border border-white/70 bg-white/75 px-4 py-2.5 shadow-[0_10px_40px_-12px_rgba(1,8,27,0.18)] backdrop-blur-xl"
      >
        <Image src="/sama_naffa_logo.png" alt="Sama Naffa" width={2072} height={1164} className="h-7 w-auto" priority />
      </Link>

      {/* Floating pill nav */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-full border border-white/70 bg-white/75 px-2 py-2 shadow-[0_10px_40px_-12px_rgba(1,8,27,0.18)] backdrop-blur-xl">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                active ? 'bg-[#01081b] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-[#01081b]'
              }`}
            >
              <Icon size={15} strokeWidth={2} />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Top-right cluster */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
        <button
          onClick={() => setPaletteOpen(true)}
          className="flex items-center gap-2 rounded-full border border-white/70 bg-white/75 py-2 pl-3 pr-2 text-sm text-slate-500 shadow-[0_10px_40px_-12px_rgba(1,8,27,0.18)] backdrop-blur-xl transition-colors hover:text-[#01081b]"
        >
          <Search size={15} />
          <span className="hidden md:inline">Rechercher</span>
          <kbd className="hidden md:flex items-center gap-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
            <Command size={10} /> K
          </kbd>
        </button>
        <button className="relative grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-white/75 text-slate-500 shadow-[0_10px_40px_-12px_rgba(1,8,27,0.18)] backdrop-blur-xl transition-colors hover:text-[#01081b]">
          <Bell size={16} />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#C38D1C]" />
        </button>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#435933] text-sm font-semibold text-white shadow-sm">AW</div>
      </div>

      <main className="mx-auto max-w-[1200px] px-5 pt-28 sm:px-8">{children}</main>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { opacity: 0; transform: translateY(8px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}
