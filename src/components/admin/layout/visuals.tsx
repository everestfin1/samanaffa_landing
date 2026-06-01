'use client'

import { initials } from '@/lib/admin/format'

/* —— Sparkline (pure SVG) —— */
export function Sparkline({
  data,
  stroke = '#435933',
  fill = 'rgba(67,89,51,0.10)',
  width = 240,
  height = 64,
}: {
  data: number[]
  stroke?: string
  fill?: string
  width?: number
  height?: number
}) {
  if (data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)
  const pts = data.map((d, i) => {
    const x = i * stepX
    const y = height - ((d - min) / range) * (height - 8) - 4
    return [x, y] as const
  })
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`
  const last = pts[pts.length - 1]
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
      <path d={area} fill={fill} />
      <path d={line} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r={3.5} fill={stroke} />
      <circle cx={last[0]} cy={last[1]} r={6} fill={stroke} opacity={0.18} />
    </svg>
  )
}

/* —— Avatar with deterministic tint —— */
const TINTS = [
  ['#e8f5e8', '#435933'],
  ['#fef3c7', '#92400e'],
  ['#e0f2fe', '#075985'],
  ['#f3e8ff', '#6b21a8'],
  ['#ffe4e6', '#9f1239'],
]
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const idx = (name?.charCodeAt(0) || 0) % TINTS.length
  const [bg, fg] = TINTS[idx]
  return (
    <div
      className="flex items-center justify-center rounded-full font-semibold shrink-0"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </div>
  )
}

/* —— Status pill (maps common admin statuses to tones) —— */
const TONE: Record<string, string> = {
  // green
  COMPLETED: 'green', APPROVED: 'green', ACTIVE: 'green', PAYMENT_SUCCESS: 'green', CONVERTED: 'green',
  // amber
  PENDING: 'amber', PAYMENT_INITIATED: 'amber', NEW: 'amber',
  // blue
  UNDER_REVIEW: 'blue', PROCESSING: 'blue', CONTACTED: 'blue',
  // red
  FAILED: 'red', REJECTED: 'red', CANCELLED: 'red', PAYMENT_FAILED: 'red', INACTIVE: 'red', EXPIRED: 'red',
}
const TONE_CLASS: Record<string, string> = {
  green: 'bg-[#e8f5e8] text-[#2f5233]',
  amber: 'bg-[#fef3c7] text-[#92400e]',
  blue: 'bg-[#e0f2fe] text-[#075985]',
  red: 'bg-[#ffe4e6] text-[#9f1239]',
  gray: 'bg-slate-100 text-slate-600',
}
const DOT_CLASS: Record<string, string> = {
  green: 'bg-[#435933]',
  amber: 'bg-[#C38D1C]',
  blue: 'bg-[#0284c7]',
  red: 'bg-[#e11d48]',
  gray: 'bg-slate-400',
}

export function StatusPill({ status, label }: { status: string; label?: string }) {
  const tone = TONE[status?.toUpperCase?.() ?? ''] ?? 'gray'
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${TONE_CLASS[tone]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${DOT_CLASS[tone]}`} />
      {label ?? status}
    </span>
  )
}
