export const fmtFCFA = (n: number) => Math.round(n || 0).toLocaleString('fr-SN')

export const fmtCompact = (n: number) => {
  const v = n || 0
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)}B`
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`
  return `${v}`
}

export const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString('fr-SN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

export const fmtDateTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString('fr-SN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

export const initials = (name: string) =>
  (name || '?')
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
