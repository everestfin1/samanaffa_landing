'use client'

import { useEffect, useState } from 'react'
import { X, ExternalLink } from 'lucide-react'

interface KycDocumentPreviewProps {
  docId: string
  fileName: string
  fetchSignedUrl: () => Promise<string | null>
  onClose: () => void
}

function isPdfFileName(fileName: string): boolean {
  return fileName.toLowerCase().endsWith('.pdf')
}

export default function KycDocumentPreview({
  docId,
  fileName,
  fetchSignedUrl,
  onClose,
}: KycDocumentPreviewProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const signed = await fetchSignedUrl()
        if (cancelled) return
        if (!signed) {
          setError('Impossible de charger le document')
          return
        }
        setUrl(signed)
      } catch {
        if (!cancelled) setError('Erreur lors du chargement')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [docId, fetchSignedUrl])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const isPdf = isPdfFileName(fileName)

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#01081b]/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Aperçu du document KYC"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <p className="truncate text-sm font-semibold text-slate-800">{fileName}</p>
          <div className="flex items-center gap-2">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#435933]"
                title="Ouvrir dans un nouvel onglet"
              >
                <ExternalLink size={18} />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex min-h-[320px] flex-1 items-center justify-center bg-slate-50 p-4">
          {loading && <p className="text-sm text-slate-500">Chargement…</p>}
          {!loading && error && <p className="text-sm text-rose-600">{error}</p>}
          {!loading && url && !isPdf && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={fileName}
              className="max-h-[70vh] max-w-full rounded-lg object-contain"
            />
          )}
          {!loading && url && isPdf && (
            <iframe
              src={url}
              title={fileName}
              className="h-[70vh] w-full rounded-lg border border-slate-200 bg-white"
            />
          )}
        </div>
      </div>
    </div>
  )
}
