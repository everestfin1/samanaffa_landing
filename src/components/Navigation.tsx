'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  Bars3Icon,
  XMarkIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOverLightBackground, setIsOverLightBackground] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  // Determine if we're on the home page or portal page based on current pathname
  const isHomePage = pathname === '/';
  const isAdminPage = pathname.startsWith('/admin');
  const isPortalPage = pathname.startsWith('/portal');
  const isApePage = pathname.startsWith('/apesenegal') || pathname.startsWith('/ape');
  const isPeePage = pathname.startsWith('/pee');
  const isMaintenancePage = pathname === '/maintenance';

  // Check authentication status on mount - client-side only
  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem('isAuthenticated');
        setIsAuthenticated(authStatus === 'true');
      } catch (error) {
        // Handle cases where localStorage is not available
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    setIsHydrated(true);

    // Listen for auth changes
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle admin route loading state (for any additional admin-specific logic)
  useEffect(() => {
    if (isAdminPage && !pathname.includes('/login')) {
      setIsAdminLoading(true);
      // Keep loading state during admin auth flow
      const timeout = setTimeout(() => {
        setIsAdminLoading(false);
      }, 200); // Slightly longer timeout for safety

      return () => clearTimeout(timeout);
    } else {
      setIsAdminLoading(false);
    }
  }, [pathname, isAdminPage]);


  // Detect when header is over light backgrounds (only on home page)
  useEffect(() => {
    // Only apply scroll detection on home page
    if (!isHomePage) {
      setIsOverLightBackground(true); // Always use solid background on other pages
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Get the main content area (excluding header)
      const mainContent = document.querySelector('main');
      if (!mainContent) return;

      // Check if we're scrolled past the hero section (which has dark background)
      const heroSection = document.querySelector('section[aria-label="Hero"]');
      const heroHeight = heroSection ? (heroSection as HTMLElement).offsetHeight : windowHeight;

      // If we're past the hero section, we're likely over light backgrounds
      const isPastHero = scrollPosition > (heroHeight - 100); // 100px buffer

      // Also check services section specifically
      const servicesSection = document.querySelector('section[aria-label="Nos services"]');
      let isInServicesSection = false;

      if (servicesSection) {
        const servicesTop = (servicesSection as HTMLElement).offsetTop - 80; // Account for header height
        const servicesBottom = servicesTop + (servicesSection as HTMLElement).offsetHeight;
        isInServicesSection = scrollPosition >= servicesTop && scrollPosition <= servicesBottom;
      }

      // Set state based on position
      setIsOverLightBackground(isPastHero || isInServicesSection);
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Hide navigation on portal page, admin pages (including during auth flow), or maintenance page
  // For admin pages, hide immediately if it's not the login page, or if loading
  const shouldHideNavigation = isPortalPage || (isAdminPage && (!pathname.includes('/login') || isAdminLoading)) || isMaintenancePage;

  if (shouldHideNavigation) {
    return null;
  }

  // Hide navigation on APE pages (they have their own header)
  if (isApePage || isPeePage) {
    return null;
  }

  return (
    <header
      className={`${
        isOverLightBackground
          ? 'bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg'
          : isHomePage
            ? ''
            : 'bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg'
      } sticky top-0 z-50 transition-all duration-300`}
      role="banner"
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex md:items-center md:justify-between h-32">
          {/* Desktop Navigation - Left Side */}
          <div className="flex items-center">
            <div className="flex items-center space-x-10">
              <Link
                href="/"
                className={`transition-all duration-300 font-semibold text-base tracking-wide hover:scale-105 ${
                  isOverLightBackground
                    ? 'sama-nav-text-secondary hover:sama-text-primary hover:drop-shadow-md'
                    : isHomePage
                      ? 'sama-text-primary/80 hover:sama-text-primary hover:drop-shadow-md'
                      : 'sama-nav-text-secondary hover:sama-text-primary hover:drop-shadow-md'
                }`}
              >
                Accueil
              </Link>

              <Link
                href="/sama-naffa"
                className={`transition-all duration-300 font-semibold text-base tracking-wide hover:scale-105 ${
                  isOverLightBackground
                    ? 'sama-nav-text-secondary hover:sama-text-green hover:drop-shadow-md'
                    : isHomePage
                      ? 'sama-text-primary/80 hover:sama-text-green hover:drop-shadow-md'
                      : 'sama-nav-text-secondary hover:sama-text-green hover:drop-shadow-md'
                }`}
              >
                Sama Naffa
              </Link>

              <Link
                href="/pee"
                className={`transition-all duration-300 font-semibold text-base tracking-wide hover:scale-105 ${
                  isOverLightBackground
                    ? 'sama-nav-text-secondary hover:sama-text-gold hover:drop-shadow-md'
                    : isHomePage
                      ? 'sama-text-primary/80 hover:sama-text-gold hover:drop-shadow-md'
                      : 'sama-nav-text-secondary hover:sama-text-gold hover:drop-shadow-md'
                }`}
              >
                Plan Épargne Éducation
              </Link>
            </div>
          </div>

          {/* Logo - Center */}
          <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex-shrink-0">
              <Link 
                href="/"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="/sama_naffa_logo.png"
                  alt="Sama Naffa"
                  width={200}
                  height={80}
                  priority
                />
              </Link>
            </div>
          </div>

          {/* User Actions - Right Side */}
          <div className="flex items-center justify-end space-x-3">
            {isHydrated ? (
              isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/portal"
                  className={`flex items-center space-x-2 transition-colors  ${
                    isOverLightBackground
                      ? 'sama-text-secondary hover:sama-text-primary'
                      : isHomePage
                        ? 'sama-text-primary/80 hover:sama-text-primary'
                        : 'sama-text-secondary hover:sama-text-primary'
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="text-sm">Mon Portail</span>
                </Link>
                <Link 
                  href="/portal"
                  className="group relative sama-gradient-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:sama-gradient-primary-hover transition-all duration-300 hover:shadow-lg hover:shadow-sama-primary-green/25 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative">Tableau de bord</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="group relative sama-gradient-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:sama-gradient-primary-hover transition-all duration-300 hover:shadow-lg hover:shadow-sama-primary-green/25 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative">Se connecter</span>
                </Link>
                {!isHomePage && (
                  <Link
                    href="/register"
                    className="group relative sama-gradient-accent text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:sama-hover-accent transition-all duration-300 hover:shadow-lg hover:shadow-sama-accent-gold/25 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative">Ouvrir mon Naffa</span>
                  </Link>
                )}
                </div>
              )
            ) : (
              // Render default state during SSR to match initial client render
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="group relative sama-gradient-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:sama-gradient-primary-hover transition-all duration-300 hover:shadow-lg hover:shadow-sama-primary-green/25 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative">Se connecter</span>
                </Link>
                {!isHomePage && (
                  <Link
                    href="/register"
                    className="group relative sama-gradient-accent text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:sama-hover-accent transition-all duration-300 hover:shadow-lg hover:shadow-sama-accent-gold/25 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative">Ouvrir mon Naffa</span>
                  </Link>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Mobile Layout */}
        <div className="flex justify-between items-center h-16 md:hidden">
          {/* Logo */}
          <div className="flex items-center flex-1 min-w-0 py-3 pl-2">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="transition-opacity hover:opacity-80 block"
              >
                <Image
                  src="/sama_naffa_logo.png"
                  alt="Sama Naffa"
                  width={120}
                  height={38}
                  priority
                  className="h-auto w-auto max-h-10"
                />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center pr-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2.5 transition-colors ${
                isOverLightBackground
                  ? 'sama-text-secondary hover:sama-text-primary'
                  : isHomePage
                    ? 'sama-text-primary hover:sama-text-gold'
                    : 'sama-text-secondary hover:sama-text-primary'
              }`}
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-7 w-7" />
              ) : (
                <Bars3Icon className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 py-3 bg-white/95 backdrop-blur-md shadow-lg border-t border-timberwolf/20">
              {/* Navigation Section */}
              <div className="mb-3">
                <p className="px-2 py-2 text-xs font-semibold text-night/50 uppercase tracking-wider">
                  Navigation
                </p>
                <div className="space-y-1">
                  <Link
                    href="/"
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg text-base font-medium text-night/80 hover:bg-timberwolf/10 hover:text-night transition-all duration-200"
                  >
                    <span>Accueil</span>
                  </Link>

                  <Link
                    href="/sama-naffa"
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg text-base font-medium text-night/80 hover:bg-sama-primary-green/10 hover:text-sama-primary-green transition-all duration-200"
                  >
                    <DevicePhoneMobileIcon className="w-5 h-5 flex-shrink-0 text-night/70" />
                    <span>Sama Naffa</span>
                  </Link>

                  <Link
                    href="/pee"
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg text-base font-medium text-night/80 hover:bg-gold-metallic/10 hover:text-gold-metallic transition-all duration-200"
                  >
                    <BuildingLibraryIcon className="w-5 h-5 flex-shrink-0 text-night/70" />
                    <span>Plan Épargne Éducation</span>
                  </Link>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-timberwolf/10 my-3"></div>
              
              {/* Auth Section */}
              <div className="space-y-2">
                {isHydrated ? (
                  isAuthenticated ? (
                    <>
                      <Link 
                        href="/portal"
                        className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-lg text-base font-medium text-night/80 hover:bg-timberwolf/10 hover:text-night transition-all duration-200"
                      >
                        <UserIcon className="w-5 h-5" />
                        <span>Mon Portail</span>
                      </Link>
                      <Link 
                        href="/portal"
                        className="group relative w-full sama-gradient-primary text-white px-6 py-3 rounded-lg font-semibold text-base hover:sama-gradient-primary-hover transition-all duration-300 text-center overflow-hidden shadow-md hover:shadow-lg"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative">Tableau de bord</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="group relative w-full sama-gradient-primary text-white px-6 py-3 rounded-lg font-semibold text-base hover:sama-gradient-primary-hover transition-all duration-300 text-center overflow-hidden shadow-md hover:shadow-lg block"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative">Se connecter</span>
                      </Link>
                      {!isHomePage && (
                        <Link
                          href="/register"
                          className="group relative w-full sama-gradient-accent text-white px-6 py-3 rounded-lg font-semibold text-base hover:sama-hover-accent transition-all duration-300 text-center overflow-hidden shadow-md hover:shadow-lg block"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          <span className="relative">Ouvrir mon Naffa</span>
                        </Link>
                      )}
                    </>
                  )
                ) : (
                  // Render default state during SSR to match initial client render
                  <>
                    <Link 
                      href="/login"
                      className="group relative w-full sama-gradient-primary text-white px-6 py-3 rounded-lg font-semibold text-base hover:sama-gradient-primary-hover transition-all duration-300 text-center overflow-hidden shadow-md hover:shadow-lg block"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <span className="relative">Se connecter</span>
                    </Link>
                    {!isHomePage && (
                      <Link 
                        href="/register"
                        className="group relative w-full sama-gradient-accent text-white px-6 py-3 rounded-lg font-semibold text-base hover:sama-hover-accent transition-all duration-300 text-center overflow-hidden shadow-md hover:shadow-lg block"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative">Ouvrir mon Naffa</span>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
