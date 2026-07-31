import Image from "next/image";
import Link from "next/link";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { SAMA_NAFFA_CONTACT } from "@/lib/contact";
import { E0_FOOTER_AGREMENT_LINE } from "@/lib/compliance-copy";

export default function E0LegalFooter() {
  const currentYear = new Date().getFullYear();

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
              {E0_FOOTER_AGREMENT_LINE}
            </p>
          </div>
          <nav aria-label="Support">
            <h2 className="e0-legal-col-title">Support</h2>
            <div className="e0-legal-muted mt-4 flex flex-col text-[13.5px] leading-[27px] font-normal">
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
            <h2 className="e0-legal-col-title">Contact</h2>
            <div className="e0-legal-muted mt-4 space-y-1.5 text-[13px] leading-[24.7px] font-normal">
              <a
                className="flex items-center gap-3 hover:text-white"
                href={SAMA_NAFFA_CONTACT.phoneHref}
              >
                <PhoneIcon className="size-4" />
                {SAMA_NAFFA_CONTACT.phone}
              </a>
              <a
                className="flex items-center gap-3 hover:text-white"
                href={SAMA_NAFFA_CONTACT.emailHref}
              >
                <EnvelopeIcon className="size-4" />
                {SAMA_NAFFA_CONTACT.email}
              </a>
              <p className="m-0 flex items-start gap-3">
                <MapPinIcon className="mt-0.5 size-4 shrink-0" />
                {SAMA_NAFFA_CONTACT.addressLine1}
                <br />
                {SAMA_NAFFA_CONTACT.addressLine2}
              </p>
            </div>
          </address>
        </div>
        <div className="e0-legal-soft mx-auto mt-10 flex max-w-[1080px] flex-col gap-4 border-t border-white/10 pt-5 text-[12.5px] sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">
            &copy; {currentYear} EVEREST Finance
          </p>
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
