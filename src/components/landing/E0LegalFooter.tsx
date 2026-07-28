import Image from "next/image";
import Link from "next/link";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export default function E0LegalFooter() {
  return (
    <footer>
      <div className="e0-legal">
        <div className="mx-auto grid max-w-[1080px] gap-10 md:grid-cols-[1.2fr_0.55fr_1fr]">
          <div>
            <Image
              src="/figma/e0/logo-small.png"
              alt="Sama Naffa"
              width={104}
              height={58}
              className="h-[58px] w-auto object-contain"
            />
            <p className="e0-legal-muted mt-4 max-w-sm text-sm leading-relaxed">
              Sama Naffa est un service de gestion sous mandat de EVEREST Finance,
              Société agréée et régulée par l&apos;AMF-UMOA n° SGI/2016-01
            </p>
          </div>
          <nav aria-label="Support">
            <h2 className="m-0 text-sm font-bold text-[var(--sama-periglacial)]">Support</h2>
            <div className="e0-legal-muted mt-4 flex flex-col gap-2 text-sm">
              <Link href="/faq" className="hover:text-white">
                FAQ
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
              <Link href="/contact" className="hover:text-white">
                Réclamations
              </Link>
            </div>
          </nav>
          <address className="not-italic">
            <h2 className="m-0 text-sm font-bold text-[var(--sama-periglacial)]">Contact</h2>
            <div className="e0-legal-muted mt-4 space-y-3 text-sm">
              <a className="flex items-center gap-3 hover:text-white" href="tel:+221338228700">
                <PhoneIcon className="size-4" />
                +221 33 822 87 00
              </a>
              <a className="flex items-center gap-3 hover:text-white" href="mailto:contact@samanaffa.com">
                <EnvelopeIcon className="size-4" />
                contact@samanaffa.com
              </a>
              <p className="m-0 flex items-start gap-3">
                <MapPinIcon className="mt-0.5 size-4 shrink-0" />
                18 Boulevard de la République
                <br />
                Dakar, Sénégal BP: 11659-13000
              </p>
            </div>
          </address>
        </div>
        <div className="e0-legal-soft mx-auto mt-10 flex max-w-[1080px] flex-col gap-4 border-t border-white/10 pt-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">© 2026 EVEREST Finance</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-white">
              Confidentialité
            </Link>
            <Link href="/terms" className="hover:text-white">
              CCU
            </Link>
            <Link href="/cookies" className="hover:text-white">
              Cookies
            </Link>
            <Link href="/contact" className="hover:text-white">
              Réclamations
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
