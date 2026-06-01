'use client'

import Link from 'next/link'
import { ArrowUpRight, Hammer } from 'lucide-react'
import { ADMIN_TAB_META, groupForTab, type AdminTabId } from '@/lib/admin/nav'

export default function SectionPlaceholder({ tabId }: { tabId: AdminTabId }) {
  const meta = ADMIN_TAB_META[tabId]
  const group = groupForTab(tabId)
  const item = group?.items.find((i) => i.id === tabId)
  const Icon = item?.icon ?? Hammer

  return (
    <div>
      <header className="mb-8">
        {group && <p className="text-sm font-medium text-slate-500">{group.label}</p>}
        <h1 className="mt-1 text-[2.25rem] font-bold leading-none tracking-tight">{meta.title}</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-500">{meta.description}</p>
      </header>

      <div className="grid place-items-center rounded-[1.75rem] border border-white bg-white p-12 text-center shadow-[0_8px_30px_-16px_rgba(1,8,27,0.12)]">
        <div className="max-w-md">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[#e8f5e8] text-[#435933]">
            <Icon className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">Section en cours de migration</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Cette section adopte progressivement la nouvelle interface. En attendant, elle reste
            pleinement fonctionnelle dans l&apos;ancienne vue.
          </p>
          <Link
            href="/admin/legacy"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#435933] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(67,89,51,0.6)] transition-colors hover:bg-[#36482a]"
          >
            Ouvrir l&apos;ancienne vue
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
