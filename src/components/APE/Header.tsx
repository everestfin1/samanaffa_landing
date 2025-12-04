"use client";

import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="https://www.everestfin.com">
              <Image
                src="/logo-everest.png"
                alt="EVEREST Finance"
                width={96}
                height={96}
                className="h-24 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-10 text-base tracking-wide font-titillium">
            <Link
              href="/apesenegal"
              className="text-gray-900 hover:text-[#C38D1C] transition-colors duration-200 font-semibold"
            >
              ACCUEIL
            </Link>
            <Link
              href="https://everestfin.com/everest-finance/"
              className="text-gray-900 hover:text-[#C38D1C] transition-colors duration-200 font-semibold"
            >
              EVEREST Finance
            </Link>
            <Link
              href="https://everestfin.com/contact/"
              className="text-gray-900 hover:text-[#C38D1C] transition-colors duration-200 font-semibold"
            >
              CONTACT
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
