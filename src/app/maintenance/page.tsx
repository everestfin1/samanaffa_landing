import Link from 'next/link'
import { SAMA_NAFFA_CONTACT } from '@/lib/contact'

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f8faf9] px-6 py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-[#01081b]">
        Maintenance en cours
      </h1>
      <p className="mt-4 max-w-md text-base text-slate-600">
        Sama Naffa est temporairement indisponible pour une mise à jour. Merci de
        réessayer dans quelques instants.
      </p>
      <p className="mt-8 text-sm text-slate-500">
        Besoin d&apos;aide ?{' '}
        <a href={SAMA_NAFFA_CONTACT.emailHref} className="font-medium text-[#435933] hover:underline">
          {SAMA_NAFFA_CONTACT.email}
        </a>
        {' · '}
        <a href={SAMA_NAFFA_CONTACT.phoneHref} className="font-medium text-[#435933] hover:underline">
          {SAMA_NAFFA_CONTACT.phone}
        </a>
      </p>
      <Link
        href="/login"
        className="mt-10 rounded-full bg-[#435933] px-6 py-3 text-sm font-semibold text-white hover:bg-[#36482a]"
      >
        Espace client
      </Link>
    </main>
  )
}
