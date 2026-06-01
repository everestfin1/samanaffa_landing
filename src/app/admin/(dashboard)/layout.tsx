'use client'

import type { ReactNode } from 'react'
import { AdminDataProvider } from '@/lib/admin/AdminDataProvider'
import AdminTopNav from '@/components/admin/layout/AdminTopNav'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminDataProvider>
      <div className="admin-canvas">
        <AdminTopNav />
        <main className="admin-canvas-main">{children}</main>
      </div>
    </AdminDataProvider>
  )
}
