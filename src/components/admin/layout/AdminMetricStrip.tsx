'use client'

export type AdminMetricTone =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'muted'

export interface AdminMetric {
  id: string
  label: string
  value: string | number
  tone?: AdminMetricTone
}

interface AdminMetricStripProps {
  metrics: AdminMetric[]
  className?: string
}

export default function AdminMetricStrip({
  metrics,
  className = '',
}: AdminMetricStripProps) {
  if (metrics.length === 0) return null

  return (
    <div className={`admin-metric-strip ${className}`.trim()} role="list">
      {metrics.map((metric, index) => (
        <div
          key={metric.id}
          className="admin-metric-strip-item"
          role="listitem"
          data-tone={metric.tone ?? 'default'}
        >
          <span className="admin-metric-strip-label">{metric.label}</span>
          <span className="admin-metric-strip-value">{metric.value}</span>
          {index < metrics.length - 1 ? (
            <span className="admin-metric-strip-divider" aria-hidden />
          ) : null}
        </div>
      ))}
    </div>
  )
}
