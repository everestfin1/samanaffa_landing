'use client'

import { Outfit } from 'next/font/google'
import '../globals.css'
import './admin.css'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${outfit.variable} admin-root`}>
      {children}
    </div>
  )
}
