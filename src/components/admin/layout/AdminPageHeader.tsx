'use client'

import type { ReactNode } from 'react'

interface AdminPageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export default function AdminPageHeader({
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="admin-page-header">
      <div className="admin-page-header-text">
        <h1 className="admin-page-title">{title}</h1>
        {description ? (
          <p className="admin-page-description">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="admin-page-header-actions">{actions}</div> : null}
    </header>
  )
}
