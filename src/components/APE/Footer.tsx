"use client";

import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="mt-16 bg-gray-light text-black max-md:flex max-md:flex-col max-md:items-center max-md:text-center">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-10 md:grid-cols-3 items-start">
        {/* Logo & Slogan */}
        <div className="space-y-4 flex justify-center">
          <Image
            src="/logo-everest.png"
            alt="EVEREST Finance"
            width={192}
            height={192}
            className="max-md:h-28 h-48 w-auto object-contain"
          />
        </div>

        {/* Address */}
        <div>
          <h3 className="font-titillium text-lg font-semibold tracking-wide text-[#C38D1C] mb-2">
            Adresse
          </h3>
          <p className="text-sm md:text-base leading-relaxed text-black/90">
            18 Boulevard de la République,<br />
            Dakar, Sénégal<br />
            BP: 11659-13000
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-titillium text-lg font-semibold tracking-wide text-[#C38D1C] mb-2">
            Contact
          </h3>
          <div className="space-y-2 text-sm md:text-base text-black/90">
            <p>
              Email<br />
              <Link
                href="mailto:contact@everestfin.com"
                className="hover:text-[#C38D1C] transition-colors duration-200"
              >
                contact@everestfin.com
              </Link>
            </p>
            <p>
              Téléphone<br />
              <Link
                href="tel:+221338228700"
                className="block hover:text-[#C38D1C] transition-colors duration-200"
              >
                +221 33 822 87 00
              </Link>
              <Link
                href="tel:+221338228701"
                className="block hover:text-[#C38D1C] transition-colors duration-200"
              >
                
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-4 text-xs md:text-sm text-black/70 text-center">
          2025 Everest Finance. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};
