import type { Metadata } from "next";
import Link from "next/link";
import { SAMA_NAFFA_CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Hors ligne — Sama Naffa",
  description:
    "Vous êtes hors ligne. Reconnectez-vous pour accéder à Sama Naffa.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f8faf9] px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#e4bd61]">
        Sama Naffa
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#01081b]">
        Vous êtes hors ligne
      </h1>
      <p className="mt-4 max-w-md text-base text-slate-600">
        Impossible de charger cette page sans connexion. Vérifiez votre réseau,
        puis réessayez.
      </p>
      <p className="mt-8 text-sm text-slate-500">
        Besoin d&apos;aide ?{" "}
        <a
          href={SAMA_NAFFA_CONTACT.emailHref}
          className="font-medium text-[#435933] hover:underline"
        >
          {SAMA_NAFFA_CONTACT.email}
        </a>
        {" · "}
        <a
          href={SAMA_NAFFA_CONTACT.phoneHref}
          className="font-medium text-[#435933] hover:underline"
        >
          {SAMA_NAFFA_CONTACT.phone}
        </a>
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-[#435933] px-6 py-3 text-sm font-semibold text-white hover:bg-[#36482a]"
      >
        Réessayer
      </Link>
    </main>
  );
}
