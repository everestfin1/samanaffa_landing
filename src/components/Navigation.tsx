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
  UserIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  PhoneIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlusDropdownOpen, setIsPlusDropdownOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOverLightBackground, setIsOverLightBackground] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine if we're on the home page or portal page based on current pathname
  const isHomePage = pathname === '/';
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPlusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    setIsPlusDropdownOpen(false);
  }, [pathname]);

  // Hide navigation on portal page
  if (isPortalPage) {
    return null;
  }

  return (
    <header
      className={`${
        isOverLightBackground
          ? 'bg-white/95 border-b border-gray-light/30 shadow-lg'
          : isHomePage
            ? 'bg-white/'
            : 'bg-white/95 border-b border-gray-light/30 shadow-lg'
      } sticky top-0 z-50  transition-all duration-300`}
      role="banner"
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link 
                href="/"
                className="transition-opacity hover:opacity-80 drop-shadow-lg"
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

          {/* Desktop Navigation - Centered nav items */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className={`transition-colors font-medium drop-shadow ${
                  isOverLightBackground
                    ? 'text-gray-dark/80 hover:text-night'
                    : isHomePage
                      ? 'text-white/80 hover:text-white'
                      : 'text-gray-dark/80 hover:text-night'
                }`}
              >
                Accueil
              </Link>

              <Link
                href="/sama-naffa"
                className={`transition-colors font-medium drop-shadow ${
                  isOverLightBackground
                    ? 'text-gray-dark/80 hover:text-night'
                    : isHomePage
                      ? 'text-white/80 hover:text-white'
                      : 'text-gray-dark/80 hover:text-night'
                }`}
              >
                Sama Naffa
              </Link>

              <Link
                href="/ape"
                className={`transition-colors font-medium drop-shadow ${
                  isOverLightBackground
                    ? 'text-gray-dark/80 hover:text-night'
                    : isHomePage
                      ? 'text-white/80 hover:text-white'
                      : 'text-gray-dark/80 hover:text-night'
                }`}
              >
                APE Sénégal
              </Link>

              {/* Plus Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsPlusDropdownOpen(!isPlusDropdownOpen)}
                  className={`flex items-center space-x-1 transition-colors font-medium drop-shadow ${
                    isOverLightBackground
                      ? 'text-gray-dark/80 hover:text-night'
                      : isHomePage
                        ? 'text-white/80 hover:text-white'
                        : 'text-gray-dark/80 hover:text-night'
                  }`}
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Plus</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${isPlusDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isPlusDropdownOpen && (
                  <div className={`absolute top-full left-0 mt-2 w-48 rounded-lg shadow-2xl border py-2 z-50 backdrop-blur-md ${
                    isOverLightBackground
                      ? 'bg-white/95 border-gray-light/30'
                      : isHomePage
                        ? 'bg-white/95 border-gold-metallic/20'
                        : 'bg-white/95 border-gray-light/30'
                  }`}>
                    <Link
                      href="/faq"
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gold-metallic/10 transition-colors"
                    >
                      <QuestionMarkCircleIcon className="w-5 h-5 text-gold-metallic" />
                      <span className="font-medium text-night">FAQ</span>
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gold-metallic/10 transition-colors"
                    >
                      <PhoneIcon className="w-5 h-5 text-gold-metallic" />
                      <span className="font-medium text-night">Contact</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Actions - Right aligned */}
          <div className="hidden md:flex items-center space-x-3">
            {isHydrated ? (
              isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/portal"
                  className={`flex items-center space-x-2 transition-colors drop-shadow ${
                    isOverLightBackground
                      ? 'text-gray-dark/80 hover:text-night'
                      : isHomePage
                        ? 'text-white/80 hover:text-white'
                        : 'text-gray-dark/80 hover:text-night'
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="text-sm">Mon Portail</span>
                </Link>
                <Link 
                  href="/portal"
                  className="bg-gradient-to-r from-gold-dark to-gold-metallic text-night px-6 py-2.5 rounded-lg font-semibold text-sm hover:from-gold-metallic hover:to-gold-light transition-all duration-300 hover:shadow-lg hover:shadow-gold-metallic/25"
                >
                  Tableau de bord
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login"
                    className={`transition-colors text-sm font-medium drop-shadow ${
                      isOverLightBackground
                        ? 'text-gray-dark/80 hover:text-night'
                        : isHomePage
                          ? 'text-white/80 hover:text-white'
                          : 'text-gray-dark/80 hover:text-night'
                    }`}
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-gold-dark to-gold-metallic text-night px-6 py-2.5 rounded-lg font-semibold text-sm hover:from-gold-metallic hover:to-gold-light transition-all duration-300 hover:shadow-lg hover:shadow-gold-metallic/25"
                  >
                    Commencer
                  </Link>
                </div>
              )
            ) : (
              // Render default state during SSR to match initial client render
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className={`transition-colors text-sm font-medium drop-shadow ${
                    isOverLightBackground
                      ? 'text-gray-dark/80 hover:text-night'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Se connecter
                </Link>
                <Link 
                  href="/register"
                  className="bg-gradient-to-r from-gold-dark to-gold-metallic text-night px-6 py-2.5 rounded-lg font-semibold text-sm hover:from-gold-metallic hover:to-gold-light transition-all duration-300 hover:shadow-lg hover:shadow-gold-metallic/25"
                >
                  Commencer
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 drop-shadow transition-colors ${
                isOverLightBackground
                  ? 'text-gray-dark hover:text-night'
                  : isHomePage
                    ? 'text-white hover:text-gold-metallic'
                    : 'text-gray-dark hover:text-night'
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
          <div className={`md:hidden border-t backdrop-blur-md ${
            isOverLightBackground
              ? 'bg-white/95 border-gray-light/30'
              : isHomePage
                ? 'border-white/20 bg-white/95'
                : 'bg-white/95 border-gray-light/30'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-night/70 hover:text-night hover:bg-timberwolf/20 transition-colors"
              >
                Accueil
              </Link>

              <Link
                href="/sama-naffa"
                className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md text-base font-medium text-night/70 hover:text-night hover:bg-timberwolf/20 transition-colors"
              >
                <DevicePhoneMobileIcon className="w-5 h-5" />
                <span>Sama Naffa</span>
              </Link>

              <Link
                href="/ape"
                className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md text-base font-medium text-night/70 hover:text-night hover:bg-timberwolf/20 transition-colors"
              >
                <BuildingLibraryIcon className="w-5 h-5" />
                <span>APE Sénégal</span>
              </Link>

              {/* Mobile Plus Section */}
              <div className="px-3 py-2">
                <div className="text-sm font-medium text-night/50 mb-2">Plus</div>
                <div className="space-y-1 ml-2">
                  <Link
                    href="/faq"
                    className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md text-base font-medium text-night/70 hover:text-night hover:bg-timberwolf/20 transition-colors"
                  >
                    <QuestionMarkCircleIcon className="w-5 h-5" />
                    <span>FAQ</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md text-base font-medium text-night/70 hover:text-night hover:bg-timberwolf/20 transition-colors"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    <span>Contact</span>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className={`border-t px-2 pt-3 pb-3 ${
              isOverLightBackground
                ? 'border-gray-light/30'
                : isHomePage
                  ? 'border-timberwolf/20'
                  : 'border-gray-light/30'
            }`}>
              {isHydrated ? (
                isAuthenticated ? (
                <div className="space-y-2">
                  <Link 
                    href="/portal"
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 text-night/70 hover:text-night transition-colors"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Mon Portail</span>
                  </Link>
                  <Link 
                    href="/portal"
                    className="w-full bg-gold-metallic text-night px-4 py-2 rounded-lg font-semibold hover:bg-gold-metallic/90 transition-colors"
                  >
                    Tableau de bord
                  </Link>
                </div>
              ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="w-full text-left px-3 py-2 text-night/70 hover:text-night transition-colors font-medium"
                    >
                      Se connecter
                    </Link>
                    <Link
                      href="/register"
                      className="w-full bg-gold-metallic text-night px-4 py-2 rounded-lg font-semibold hover:bg-gold-metallic/90 transition-colors"
                    >
                      Commencer
                    </Link>
                  </div>
                )
              ) : (
                // Render default state during SSR to match initial client render
                <div className="space-y-2">
                  <Link 
                    href="/login"
                    className="w-full text-left px-3 py-2 text-night/70 hover:text-night transition-colors font-medium"
                  >
                    Se connecter
                  </Link>
                  <Link 
                    href="/register"
                    className="w-full bg-gold-metallic text-night px-4 py-2 rounded-lg font-semibold hover:bg-gold-metallic/90 transition-colors"
                  >
                    Commencer
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
