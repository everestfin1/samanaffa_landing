'use client';

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

type E0MarketingHeaderProps = {
  active?: 'accueil' | 'nattukaay';
};

export default function E0MarketingHeader({ active = 'accueil' }: E0MarketingHeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const linkClass = (key: 'accueil' | 'nattukaay') =>
    [
      'text-[15px] font-medium transition-colors hover:text-[var(--sama-marigold)]',
      active === key ? 'text-[var(--sama-forest)]' : 'text-[var(--sama-cod-gray)]',
    ].join(' ');

  const navLinks = (
    <>
      <Link
        className={linkClass('accueil')}
        href="/"
        aria-current={active === 'accueil' ? 'page' : undefined}
      >
        Accueil
      </Link>
      <Link
        className={linkClass('nattukaay')}
        href="/sama-naffa"
        aria-current={active === 'nattukaay' ? 'page' : undefined}
      >
        Nattukaay Yéené
      </Link>
    </>
  );

  return (
    <header className="e0-header">
      <div className="relative mx-auto flex h-[81px] max-w-[1200px] items-center justify-between gap-3 px-5 sm:px-8 lg:px-11">
        <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-8">
          <button
            type="button"
            className="e0-header-menu-btn md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="e0-mobile-nav"
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="size-6" aria-hidden />
            ) : (
              <Bars3Icon className="size-6" aria-hidden />
            )}
          </button>

          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-8 md:flex"
          >
            {navLinks}
          </nav>
        </div>

        <Link
          className="absolute left-1/2 max-w-[42%] -translate-x-1/2 transition-opacity hover:opacity-80 sm:max-w-none"
          href="/"
          aria-label="Accueil Sama Naffa"
        >
          <Image
            src="/figma/e0/logo-small.png"
            alt="Sama Naffa par Everest Finance"
            width={104}
            height={58}
            priority
            className="h-[44px] w-auto object-contain sm:h-[58px]"
          />
        </Link>

        <Link href="/login" className="e0-cta-forest relative z-10 ml-auto shrink-0">
          Se connecter
        </Link>
      </div>

      {isMobileMenuOpen && (
        <nav
          id="e0-mobile-nav"
          aria-label="Navigation mobile"
          className="e0-header-mobile-nav border-t border-[var(--sama-pearl-bush)] bg-white px-5 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">{navLinks}</div>
        </nav>
      )}
    </header>
  );
}
