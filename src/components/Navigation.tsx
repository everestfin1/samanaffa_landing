'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bars3Icon,
  XMarkIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  UserIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

export default function Navigation() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check authentication status on mount
  useEffect(() => {
    // Check if user is authenticated (you can implement your own logic here)
    const checkAuth = () => {
      // For demo purposes, check localStorage or session storage
      const authStatus = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(authStatus === 'true');
    };
    
    checkAuth();
    
    // Listen for auth changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServicesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigate = (page: string) => {
    // Use Next.js router for navigation
    switch (page) {
      case 'home':
        router.push('/');
        break;
      case 'sama-naffa':
        router.push('/sama-naffa');
        break;
      case 'ape':
        router.push('/ape');
        break;
      case 'faq':
        router.push('/faq');
        break;
      case 'contact':
        router.push('/contact');
        break;
      case 'login':
        router.push('/login');
        break;
      case 'register':
        router.push('/register');
        break;
      case 'portal':
      case 'dashboard':
        router.push('/portal');
        break;
      default:
        break;
    }
    setIsMobileMenuOpen(false);
    setIsServicesDropdownOpen(false);
  };

  return (
    <header className="bg-white/95 border-b border-timberwolf/20 sticky top-0 z-50 backdrop-blur-sm" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link 
                href="/"
                className="text-2xl font-bold text-night hover:text-gold-metallic transition-colors"
              >
                Sama Naffa
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-night/70 hover:text-night transition-colors font-medium"
            >
              Accueil
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                className="flex items-center space-x-1 text-night/70 hover:text-night transition-colors font-medium"
              >
                <span>Services</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isServicesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-timberwolf/20 py-2 z-50">
                  <Link
                    href="/sama-naffa"
                    className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-timberwolf/10 transition-colors"
                  >
                    <DevicePhoneMobileIcon className="w-5 h-5 text-gold-metallic" />
                    <div>
                      <div className="font-medium text-night">Sama Naffa</div>
                      <div className="text-sm text-night/60">Banque digitale et épargne</div>
                    </div>
                  </Link>
                  <Link
                    href="/ape"
                    className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-timberwolf/10 transition-colors"
                  >
                    <BuildingLibraryIcon className="w-5 h-5 text-gold-metallic" />
                    <div>
                      <div className="font-medium text-night">APE Sénégal</div>
                      <div className="text-sm text-night/60">Investissements et obligations</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/faq"
              className="flex items-center space-x-1 text-night/70 hover:text-night transition-colors font-medium"
            >
              <span>FAQ</span>
            </Link>
            
            <Link
              href="/contact"
              className="flex items-center space-x-1 text-night/70 hover:text-night transition-colors font-medium"
            >
              <span>Contact</span>
            </Link>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/portal"
                    className="flex items-center space-x-2 text-night/70 hover:text-night transition-colors"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="text-sm">Mon Portail</span>
                  </Link>
                  <Link 
                    href="/portal"
                    className="bg-gold-metallic text-night px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gold-metallic/90 transition-colors"
                  >
                    Tableau de bord
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/login"
                    className="text-night/70 hover:text-night transition-colors text-sm font-medium"
                  >
                    Se connecter
                  </Link>
                  <Link 
                    href="/register"
                    className="bg-gold-metallic text-night px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gold-metallic/90 transition-colors"
                  >
                    Commencer
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-night p-2"
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
          <div className="md:hidden border-t border-timberwolf/20 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-night/70 hover:text-night hover:bg-timberwolf/20 transition-colors"
              >
                Accueil
              </Link>
              
              {/* Mobile Services Section */}
              <div className="px-3 py-2">
                <div className="text-sm font-medium text-night/50 mb-2">Services</div>
                <div className="space-y-1 ml-2">
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
                </div>
              </div>
              
              <Link
                href="/faq"
                className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md text-base font-medium text-night/70 hover:text-night hover:bg-timberwolf/20 transition-colors"
              >
                <span>FAQ</span>
              </Link>
              
              <Link
                href="/contact"
                className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md text-base font-medium text-night/70 hover:text-night hover:bg-timberwolf/20 transition-colors"
              >
                <span>Contact</span>
              </Link>
            </div>
            
            <div className="border-t border-timberwolf/20 px-2 pt-3 pb-3">
              {isAuthenticated ? (
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
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
