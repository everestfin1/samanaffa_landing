'use client';

import { initials } from '../_data/mock';

/* —— Sparkline (pure SVG, no deps) —— */
export function Sparkline({
  data,
  stroke = '#435933',
  fill = 'rgba(67,89,51,0.10)',
  width = 240,
  height = 64,
}: {
  data: number[];
  stroke?: string;
  fill?: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((d, i) => {
    const x = i * stepX;
    const y = height - ((d - min) / range) * (height - 8) - 4;
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
      <path d={area} fill={fill} />
      <path d={line} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r={3.5} fill={stroke} />
      <circle cx={last[0]} cy={last[1]} r={6} fill={stroke} opacity={0.18} />
    </svg>
  );
}

/* —— Avatar with deterministic tint —— */
const TINTS = [
  ['#e8f5e8', '#435933'],
  ['#fef3c7', '#92400e'],
  ['#e0f2fe', '#075985'],
  ['#f3e8ff', '#6b21a8'],
  ['#ffe4e6', '#9f1239'],
];
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const idx = name.charCodeAt(0) % TINTS.length;
  const [bg, fg] = TINTS[idx];
  return (
    <div
      className="flex items-center justify-center rounded-full font-semibold shrink-0"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </div>
  );
}

/* —— Status pill —— */
const PILL: Record<string, string> = {
  completed: 'bg-[#e8f5e8] text-[#2f5233]',
  approved: 'bg-[#e8f5e8] text-[#2f5233]',
  pending: 'bg-[#fef3c7] text-[#92400e]',
  under_review: 'bg-[#e0f2fe] text-[#075985]',
  processing: 'bg-[#e0f2fe] text-[#075985]',
  failed: 'bg-[#ffe4e6] text-[#9f1239]',
  rejected: 'bg-[#ffe4e6] text-[#9f1239]',
};
const DOT: Record<string, string> = {
  completed: 'bg-[#435933]',
  approved: 'bg-[#435933]',
  pending: 'bg-[#C38D1C]',
  under_review: 'bg-[#0284c7]',
  processing: 'bg-[#0284c7]',
  failed: 'bg-[#e11d48]',
  rejected: 'bg-[#e11d48]',
};

export function StatusPill({ status, label }: { status: string; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${PILL[status] ?? 'bg-slate-100 text-slate-600'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${DOT[status] ?? 'bg-slate-400'}`} />
      {label}
    </span>
  );
}

export function StatusDot({ status }: { status: string }) {
  return <span className={`w-1.5 h-1.5 rounded-full ${DOT[status] ?? 'bg-slate-400'}`} />;
}
