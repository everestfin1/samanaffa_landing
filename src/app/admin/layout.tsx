'use client'

import { Geist } from 'next/font/google'
import '../globals.css'
import './admin.css'
import './admin-sama-theme.css'
import './admin-ui.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${geistSans.variable} admin-root`}>
      {children}
    </div>
  )
}
