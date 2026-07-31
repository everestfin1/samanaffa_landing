"use client";

import Image from "next/image";
import Link from "next/link";
import { SAMA_NAFFA_CONTACT } from "@/lib/contact";

export const Footer = ({ isApe }: { isApe: boolean }) => {
  const currentYear = new Date().getFullYear();
  const backgroundColor = isApe ? "bg-gray-light" : "bg-[#20163B]";
  const textColor = isApe ? "text-black" : "text-white";
  return (
    <footer className={`mt-16 ${backgroundColor} ${textColor} max-md:flex max-md:flex-col max-md:items-center max-md:text-center`}>
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-10 md:grid-cols-3 items-start">
        <div className="space-y-4 flex justify-center">
          <Image
            src="/logo-everest.png"
            alt="EVEREST Finance"
            width={192}
            height={192}
            className="max-md:h-28 h-48 w-auto object-contain"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold tracking-wide text-[#C38D1C] mb-2">
            Adresse
          </h3>
          <p className="text-sm md:text-base leading-relaxed">
            {SAMA_NAFFA_CONTACT.addressLine1},<br />
            {SAMA_NAFFA_CONTACT.addressLine2}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold tracking-wide text-[#C38D1C] mb-2">
            Contact
          </h3>
          <div className="space-y-2 text-sm md:text-base">
            <p>
              Email<br />
              <Link
                href={SAMA_NAFFA_CONTACT.emailHref}
                className="hover:text-[#C38D1C] transition-colors duration-200"
              >
                {SAMA_NAFFA_CONTACT.email}
              </Link>
            </p>
            <p>
              Téléphone<br />
              <Link
                href={SAMA_NAFFA_CONTACT.phoneHref}
                className="block hover:text-[#C38D1C] transition-colors duration-200"
              >
                {SAMA_NAFFA_CONTACT.phone}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-4 text-xs md:text-sm text-center">
          &copy; {currentYear} Everest Finance. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};
