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

  // Check authentication status on mount
  useEffect(() => {
    // Check if user is authenticated (you can implement your own logic here)
    const checkAuth = () => {
      // For demo purposes, check localStorage or session storage
      const authStatus = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(authStatus === 'true');
    };
    
    checkAuth();
    setIsHydrated(true);
    
    // Listen for auth changes
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
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

  // Hide navigation on portal page or admin pages (including during auth flow)
  // For admin pages, hide immediately if it's not the login page, or if loading
  const shouldHideNavigation = isPortalPage || (isAdminPage && (!pathname.includes('/login') || isAdminLoading));

  if (shouldHideNavigation) {
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
        <div className="hidden md:flex md:items-center md:justify-between h-20">
          {/* Desktop Navigation - Left Side */}
          <div className="flex items-center">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className={`transition-colors font-medium  ${
                  isOverLightBackground
                    ? 'sama-text-secondary hover:sama-text-primary'
                    : isHomePage
                      ? 'sama-text-primary/80 hover:sama-text-primary'
                      : 'sama-text-secondary hover:sama-text-primary'
                }`}
              >
                Accueil
              </Link>

              <Link
                href="/sama-naffa"
                className={`transition-colors font-medium  ${
                  isOverLightBackground
                    ? 'sama-text-secondary hover:sama-text-green'
                    : isHomePage
                      ? 'sama-text-primary/80 hover:sama-text-green'
                      : 'sama-text-secondary hover:sama-text-green'
                }`}
              >
                Sama Naffa
              </Link>

              <Link
                href="/ape"
                className={`transition-colors font-medium  ${
                  isOverLightBackground
                    ? 'sama-text-secondary hover:sama-text-gold'
                    : isHomePage
                      ? 'sama-text-primary/80 hover:sama-text-gold'
                      : 'sama-text-secondary hover:sama-text-gold'
                }`}
              >
                Emprunt Obligataire
              </Link>

            </div>
          </div>

          {/* Logo - Center */}
          <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex-shrink-0">
              <Link 
                href="/"
                className="transition-opacity hover:opacity-80 "
              >
                <Image
                  src="/sama_naffa_logo.png"
                  alt="Sama Naffa"
                  width={160}
                  height={53}
                  className="h-16 w-auto"
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
                  className="group relative sama-gradient-accent text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:sama-hover-accent transition-all duration-300 hover:shadow-lg hover:shadow-sama-accent-gold/25 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative">Se connecter</span>
                </Link>
                {!isHomePage && (
                  <Link 
                    href="/register"
                    className="group relative sama-gradient-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:sama-gradient-primary-hover transition-all duration-300 hover:shadow-lg hover:shadow-sama-primary-green/25 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative">Ouvrir mon compte</span>
                  </Link>
                )}
                </div>
              )
            ) : (
              // Render default state during SSR to match initial client render
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="group relative sama-gradient-accent text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:sama-hover-accent transition-all duration-300 hover:shadow-lg hover:shadow-sama-accent-gold/25 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative">Se connecter</span>
                </Link>
                {!isHomePage && (
                  <Link 
                    href="/register"
                    className="group relative sama-gradient-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:sama-gradient-primary-hover transition-all duration-300 hover:shadow-lg hover:shadow-sama-primary-green/25 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative">Ouvrir mon compte</span>
                  </Link>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Mobile Layout */}
        <div className="flex justify-between items-center h-20 md:hidden">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link 
                href="/"
                className="transition-opacity hover:opacity-80 "
              >
                <Image
                  src="/sama_naffa_logo.png"
                  alt="Sama Naffa"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2  transition-colors ${
                isOverLightBackground
                  ? 'sama-text-secondary hover:sama-text-primary'
                  : isHomePage
                    ? 'sama-text-primary hover:sama-text-gold'
                    : 'sama-text-secondary hover:sama-text-primary'
              }`}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t border-white/20 bg-white/80 backdrop-blur-md`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium sama-text-secondary hover:sama-text-primary hover:sama-bg-light-green transition-colors"
              >
                Accueil
              </Link>

              <Link
                href="/sama-naffa"
                className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md text-base font-medium sama-text-secondary hover:sama-text-green hover:sama-bg-light-green transition-colors"
              >
                <DevicePhoneMobileIcon className="w-5 h-5" />
                <span>Sama Naffa</span>
              </Link>

              <Link
                href="/ape"
                className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md text-base font-medium sama-text-secondary hover:sama-text-gold hover:bg-sama-accent-gold/10 transition-colors"
              >
                <BuildingLibraryIcon className="w-5 h-5" />
                <span>Emprunt Obligataire</span>
              </Link>

            </div>
            
            <div className={`border-t px-2 pt-3 pb-3 ${
              isOverLightBackground
                ? 'sama-border-light'
                : isHomePage
                  ? 'border-white/20'
                  : 'sama-border-light'
            }`}>
              {isHydrated ? (
                isAuthenticated ? (
                <div className="space-y-2">
                  <Link 
                    href="/portal"
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 sama-text-secondary hover:sama-text-primary transition-colors"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Mon Portail</span>
                  </Link>
                  <Link 
                    href="/portal"
                    className="group relative w-full sama-gradient-primary text-white px-4 py-2 rounded-lg font-semibold hover:sama-gradient-primary-hover transition-colors overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative">Tableau de bord</span>
                  </Link>
                </div>
              ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="group relative w-full sama-gradient-accent text-white px-4 py-2 rounded-lg font-semibold hover:sama-hover-accent transition-colors text-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <span className="relative">Se connecter</span>
                    </Link>
                    {!isHomePage && (
                      <Link
                        href="/register"
                        className="group relative w-full sama-gradient-primary text-white px-4 py-2 rounded-lg font-semibold hover:sama-gradient-primary-hover transition-colors text-center overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative">Ouvrir mon compte</span>
                      </Link>
                    )}
                  </div>
                )
              ) : (
                // Render default state during SSR to match initial client render
                <div className="space-y-2">
                  <Link 
                    href="/login"
                    className="w-full text-left px-3 py-2 sama-text-secondary hover:sama-text-primary transition-colors font-medium"
                  >
                    Se connecter
                  </Link>
                  <Link 
                    href="/register"
                    className="group relative w-full sama-gradient-accent text-white px-4 py-2 rounded-lg font-semibold hover:sama-hover-accent transition-colors overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative">Commencer</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
