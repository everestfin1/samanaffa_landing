'use client'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface AdminEmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export default function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: AdminEmptyStateProps) {
  return (
    <div className="admin-empty-state-v2">
      <div className="admin-empty-state-v2-icon" aria-hidden>
        <Icon className="w-6 h-6" />
      </div>
      <p className="admin-empty-state-v2-title">{title}</p>
      {description ? (
        <p className="admin-empty-state-v2-text">{description}</p>
      ) : null}
      {action ? <div className="admin-empty-state-v2-action">{action}</div> : null}
    </div>
  )
}
