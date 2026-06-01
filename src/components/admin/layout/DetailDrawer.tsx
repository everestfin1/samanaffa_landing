'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface DetailDrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function DetailDrawer({ open, onClose, title, children }: DetailDrawerProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#01081b]/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      {/* Drawer */}
      <div className="relative z-10 h-full w-full max-w-md overflow-y-auto bg-white shadow-[0_20px_60px_-20px_rgba(1,8,27,0.3)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#01081b]"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  )
}
