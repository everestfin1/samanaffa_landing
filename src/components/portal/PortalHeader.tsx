'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { usePrefetchTransactions } from '../../hooks/useTransactions';
import NotificationBell from '../notifications/NotificationBell';
import {
  UserIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
type ActiveTab = 'dashboard' | 'sama-naffa' | 'ape' | 'compare' | 'profile' | 'notifications';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userId: string;
  isNewUser: boolean;
  kycStatus: KYCStatus;
}

interface PortalHeaderProps {
  userData: UserData;
  kycStatus: KYCStatus;
  activeTab: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void; // Made optional since we'll use navigation
  onLogout: () => void;
}

export default function PortalHeader({
  userData,
  kycStatus,
  activeTab,
  setActiveTab,
  onLogout
}: PortalHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Prefetch utilities for navigation performance
  const { prefetchUserProfile, prefetchRecentTransactions } = usePrefetchTransactions();

  const handlePrefetchOnHover = () => {
    // Prefetch user profile data on navigation hover
    prefetchUserProfile();
    // Prefetch recent transactions for dashboard
    prefetchRecentTransactions(userData?.userId, 10);
  };

  const navigationItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Tableau de bord',
      icon: HomeIcon,
      ariaLabel: 'Aller au tableau de bord',
      href: '/portal/dashboard',
      requiresKYC: false // Dashboard is always accessible
    },
    {
      id: 'sama-naffa' as ActiveTab,
      label: 'Sama Naffa',
      icon: DevicePhoneMobileIcon,
      ariaLabel: 'Accéder à Sama Naffa',
      href: '/portal/sama-naffa',
      requiresKYC: true // Requires KYC approval
    },
    {
      id: 'ape' as ActiveTab,
      label: 'Emprunt Obligataire',
      icon: BuildingLibraryIcon,
      ariaLabel: 'Accéder à Emprunt Obligataire',
      href: '/portal/ape',
      requiresKYC: true // Requires KYC approval
    }
    // Removed comparison page as per simplification requirements
  ];

  const handleTabChange = (tab: ActiveTab, href: string, requiresKYC: boolean = false) => {
    // Allow navigation to all pages - KYC blocking only applies to transactions
    router.push(href);
    setIsNavDropdownOpen(false);
  };

  const getCurrentActiveTab = (): ActiveTab => {
    if (pathname.includes('/sama-naffa')) return 'sama-naffa';
    if (pathname.includes('/ape')) return 'ape';
    if (pathname.includes('/compare')) return 'compare';
    if (pathname.includes('/profile')) return 'profile';
    if (pathname.includes('/notifications')) return 'notifications';
    return 'dashboard';
  };

  const currentTab = getCurrentActiveTab();


  const toggleNavDropdown = () => {
    setIsNavDropdownOpen(!isNavDropdownOpen);
    setIsUserDropdownOpen(false); // Close user dropdown when opening nav
  };

  const closeNavDropdown = () => {
    setIsNavDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsNavDropdownOpen(false); // Close nav dropdown when opening user dropdown
  };

  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-nav-dropdown]') && !target.closest('[data-user-dropdown]')) {
        setIsNavDropdownOpen(false);
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    router.push('/portal/profile');
    closeUserDropdown();
  };

  const handleLogoutClick = () => {
    // Clear authentication state
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    localStorage.removeItem('userSource');
    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'));
    onLogout();
    closeUserDropdown();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:flex md:items-center md:justify-between h-32 relative">
          {/* Desktop Navigation - Left Side */}
          <div className="flex items-center flex-1 min-w-0 mr-4">
            {/* Hamburger Menu Button */}
            <div className="relative" data-nav-dropdown>
            <button
              onClick={toggleNavDropdown}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg sama-text-secondary hover:bg-timberwolf/10 transition-colors"
              aria-label="Menu de navigation"
              aria-expanded={isNavDropdownOpen}
              aria-haspopup="true"
            >
                <div className="flex flex-col space-y-1">
                  <div className={`w-5 h-0.5 bg-current transition-all duration-200 ${isNavDropdownOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                  <div className={`w-5 h-0.5 bg-current transition-all duration-200 ${isNavDropdownOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`w-5 h-0.5 bg-current transition-all duration-200 ${isNavDropdownOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                </div>
                <span className="hidden lg:inline ml-2 text-sm font-medium">Menu</span>
              </button>

              {/* Navigation Dropdown */}
              {isNavDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-timberwolf/20 py-2 z-50">
                  <div className="px-4 py-2 border-b border-timberwolf/10 mb-2">
                    <p className="text-sm font-medium text-night">Navigation</p>
                  </div>
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = currentTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id, item.href, item.requiresKYC)}
                        onMouseEnter={handlePrefetchOnHover}
                        className={`flex items-center space-x-3 w-full text-left px-4 py-3 transition-colors ${
                          isActive
                            ? item.id === 'sama-naffa'
                              ? 'bg-sama-primary-green text-white'
                              : 'bg-gold-metallic text-white'
                            : 'text-night/80 hover:bg-timberwolf/10 hover:text-night'
                        }`}
                        aria-label={item.ariaLabel}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                          isActive ? 'text-white' : 'text-night/70'
                        }`} />
                        <span className="flex-1">{item.label}</span>
                        {isActive && (
                          <div className="w-1 h-4 bg-white rounded-sm"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Logo - Center */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10">
            <button
              onClick={() => router.push('/portal/dashboard')}
              className="transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gold-metallic focus:ring-offset-2 rounded-md p-2"
              aria-label="Retourner à l'accueil"
            >
              <Image
                src="/sama_naffa_logo.png"
                alt="Sama Naffa"
                width={180}
                height={72}
                priority
              />
            </button>
          </div>

          {/* User Actions - Right Side */}
          <div className="flex items-center justify-end flex-1 min-w-0 ml-4 space-x-4">
            {/* Notifications */}
            <NotificationBell />
            
            {/* User Menu */}
            <div className="relative" data-user-dropdown>
              <button
                onClick={toggleUserDropdown}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg sama-text-secondary hover:bg-timberwolf/10 transition-all duration-200"
                aria-label="Menu utilisateur"
                aria-expanded={isUserDropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 bg-sama-primary-green rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                  </span>
                </div>
                <div className="hidden lg:flex flex-col items-start min-w-0">
                  <span className="text-sm font-medium text-night truncate">
                    {userData.firstName}
                  </span>
                  <span className="text-xs text-night/50 truncate">Mon compte</span>
                </div>
                <svg 
                  className={`w-4 h-4 transition-transform hidden lg:block ${isUserDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-timberwolf/20 py-1 z-50">
                  {/* Profile Option */}
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-night/80 hover:bg-timberwolf/10 hover:text-night transition-colors"
                  >
                    <UserIcon className="w-4 h-4 mr-3 flex-shrink-0 text-night/70" />
                    <span className="flex-1 text-left">Mon profil</span>
                  </button>

                  {/* Divider */}
                  <div className="my-1 border-t border-timberwolf/10"></div>

                  {/* Logout Option */}
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span className="flex-1 text-left">Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Layout */}
      <div className="flex justify-between items-center h-20 md:hidden">
        {/* Mobile Navigation - Left Side */}
        <div className="flex items-center">
          {/* Hamburger Menu Button */}
          <div className="relative" data-nav-dropdown>
            <button
              onClick={toggleNavDropdown}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg sama-text-secondary hover:bg-timberwolf/10 transition-colors"
              aria-label="Menu de navigation"
              aria-expanded={isNavDropdownOpen}
              aria-haspopup="true"
            >
              <div className="flex flex-col space-y-1">
                <div className={`w-5 h-0.5 bg-current transition-all duration-200 ${isNavDropdownOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-current transition-all duration-200 ${isNavDropdownOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-current transition-all duration-200 ${isNavDropdownOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>

            {/* Navigation Dropdown */}
            {isNavDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-timberwolf/20 py-2 z-50">
                <div className="px-4 py-2 border-b border-timberwolf/10 mb-2">
                  <p className="text-sm font-medium text-night">Navigation</p>
                </div>
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id, item.href, item.requiresKYC)}
                      onMouseEnter={handlePrefetchOnHover}
                      className={`flex items-center space-x-3 w-full text-left px-4 py-3 transition-colors ${
                        isActive
                          ? item.id === 'sama-naffa'
                            ? 'bg-sama-primary-green text-white'
                            : 'bg-gold-metallic text-white'
                          : 'text-night/80 hover:bg-timberwolf/10 hover:text-night'
                      }`}
                      aria-label={item.ariaLabel}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-night/70'
                      }`} />
                      <span className="flex-1">{item.label}</span>
                      {isActive && (
                        <div className="w-1 h-4 bg-white rounded-sm"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Logo - Center */}
        <div className="flex items-center">
          <button
            onClick={() => router.push('/portal/dashboard')}
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src="/sama_naffa_logo.png"
              alt="Sama Naffa"
              width={120}
              height={40}
              priority
            />
          </button>
        </div>

        {/* Mobile Actions - Right Side */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <NotificationBell />
          
          {/* User Menu */}
          <div className="relative" data-user-dropdown>
            <button
              onClick={toggleUserDropdown}
              className="w-10 h-10 bg-sama-primary-green rounded-full flex items-center justify-center flex-shrink-0"
              aria-label="Menu utilisateur"
              aria-expanded={isUserDropdownOpen}
              aria-haspopup="true"
            >
              <span className="text-white font-semibold text-sm">
                {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
              </span>
            </button>

            {/* User Dropdown Menu */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-timberwolf/20 py-1 z-50">
                {/* Profile Option */}
                <button
                  onClick={handleProfileClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-night/80 hover:bg-timberwolf/10 hover:text-night transition-colors"
                >
                  <UserIcon className="w-4 h-4 mr-3 flex-shrink-0 text-night/70" />
                  <span className="flex-1 text-left">Mon profil</span>
                </button>

                {/* Divider */}
                <div className="my-1 border-t border-timberwolf/10"></div>

                {/* Logout Option */}
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="flex-1 text-left">Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


    </header>
  );
}
