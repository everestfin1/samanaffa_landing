'use client'

import { useEffect } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useAdminData } from '@/lib/admin/AdminDataProvider'

export default function AdminFeedbackBanner() {
  const { error, feedback, clearFeedback, dismissError } = useAdminData()

  useEffect(() => {
    if (feedback?.type !== 'success') return
    const timer = window.setTimeout(() => clearFeedback(), 5000)
    return () => window.clearTimeout(timer)
  }, [feedback, clearFeedback])

  const message = error ?? feedback?.message
  if (!message) return null

  const isSuccess = !error && feedback?.type === 'success'

  return (
    <div
      className={`mx-auto mb-6 flex max-w-5xl items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-sm ${
        isSuccess
          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
          : 'border-rose-200 bg-rose-50 text-rose-900'
      }`}
      role="alert"
    >
      <div className="flex items-start gap-2">
        {isSuccess ? (
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
        ) : (
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-600" />
        )}
        <p>{message}</p>
      </div>
      <button
        type="button"
        onClick={() => {
          if (error) dismissError()
          else clearFeedback()
        }}
        className="rounded-lg p-1 opacity-70 transition-opacity hover:opacity-100"
        aria-label="Fermer"
      >
        <X size={16} />
      </button>
    </div>
  )
}
