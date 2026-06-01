'use client'

import type { ReactNode } from 'react'

interface AdminPanelProps {
  title?: string
  description?: string
  toolbar?: ReactNode
  children: ReactNode
  flush?: boolean
  className?: string
}

export default function AdminPanel({
  title,
  description,
  toolbar,
  children,
  flush = false,
  className = '',
}: AdminPanelProps) {
  const hasHeader = title || description || toolbar

  return (
    <section className={`admin-panel ${className}`.trim()}>
      {hasHeader ? (
        <div className="admin-panel-header">
          {(title || description) && (
            <div className="admin-panel-header-text">
              {title ? <h2 className="admin-panel-title">{title}</h2> : null}
              {description ? (
                <p className="admin-panel-description">{description}</p>
              ) : null}
            </div>
          )}
          {toolbar ? <div className="admin-panel-toolbar">{toolbar}</div> : null}
        </div>
      ) : null}
      <div className={flush ? 'admin-panel-body admin-panel-body-flush' : 'admin-panel-body'}>
        {children}
      </div>
    </section>
  )
}
