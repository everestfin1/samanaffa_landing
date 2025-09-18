'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
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

type KYCStatus = 'pending' | 'in_progress' | 'documents_required' | 'under_review' | 'approved' | 'rejected';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Tableau de bord',
      icon: HomeIcon,
      ariaLabel: 'Aller au tableau de bord',
      href: '/portal/dashboard'
    },
    {
      id: 'sama-naffa' as ActiveTab,
      label: 'Sama Naffa',
      icon: DevicePhoneMobileIcon,
      ariaLabel: 'Accéder à Sama Naffa',
      href: '/portal/sama-naffa'
    },
    {
      id: 'ape' as ActiveTab,
      label: 'Emprunt Obligataire',
      icon: BuildingLibraryIcon,
      ariaLabel: 'Accéder à Emprunt Obligataire',
      href: '/portal/ape'
    }
    // Removed comparison page as per simplification requirements
  ];

  const handleTabChange = (tab: ActiveTab, href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false);
  };

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
    <header className="bg-white/95 backdrop-blur-sm border-b border-timberwolf/30 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => router.push('/portal/dashboard')}
              className="transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gold-metallic focus:ring-offset-2 rounded-md p-2"
              aria-label="Retourner à l'accueil"
            >
              <Image
                src="/sama_naffa_logo.png"
                alt="Sama Naffa"
                width={100}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </button>
          </div>

          {/* Desktop Navigation - Compact with Labels */}
          {(
            <nav 
              className="hidden md:flex items-center space-x-2 lg:space-x-3"
              role="navigation"
              aria-label="Navigation principale"
            >
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id, item.href)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-metallic focus:ring-offset-2 ${
                      isActive
                        ? 'bg-gold-metallic text-white shadow-sm'
                        : 'text-night/70 hover:text-night hover:bg-timberwolf/10'
                    }`}
                    aria-label={item.ariaLabel}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <IconComponent className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-night/70'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* User Actions - Right Side */}
          <div className="flex items-center space-x-2">
            {/* Quick Actions: Notifications and User Dropdown */}
            {(
              <div className="flex items-center space-x-2">
                {/* Notifications Quick Access */}
                <button
                  onClick={() => router.push('/portal/notifications')}
                  className="relative p-2.5 text-night/70 hover:text-night hover:bg-timberwolf/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold-metallic focus:ring-offset-2"
                  aria-label="Notifications (raccourci)"
                  title="Notifications (raccourci)"
                >
                  <BellIcon className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-timberwolf/10 hover:bg-timberwolf/20 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-metallic focus:ring-offset-2"
                    aria-label="Menu utilisateur"
                    aria-expanded={isUserDropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-gold-metallic to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="hidden lg:flex flex-col items-start min-w-0">
                      <span className="text-sm font-medium text-night/80 truncate">
                        Bonjour, {userData.firstName}
                      </span>
                      <span className="text-xs text-night/50 truncate">{userData.email}</span>
                    </div>
                    <svg 
                      className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} 
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
                        className="flex items-center w-full px-4 py-2 text-sm text-night/80 hover:bg-timberwolf/10 hover:text-night transition-colors focus:outline-none focus:ring-2 focus:ring-gold-metallic focus:ring-offset-2"
                      >
                        <UserIcon className="w-4 h-4 mr-3 flex-shrink-0 text-night/70" />
                        <span className="flex-1 text-left">Mon profil</span>
                      </button>

                      {/* Divider */}
                      <div className="my-1 border-t border-timberwolf/10"></div>

                      {/* Logout Option */}
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <XMarkIcon className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="flex-1 text-left">Déconnexion</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            {(
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-night/70 hover:text-night hover:bg-timberwolf/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold-metallic focus:ring-offset-2"
                aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden border-t border-timberwolf/20 bg-white/95 backdrop-blur-sm"
            id="mobile-menu"
            role="navigation"
            aria-label="Navigation mobile"
          >
            <div className="px-4 py-4 space-y-1">
              {/* User Profile Section */}
              <div className="flex items-center justify-between py-3 border-b border-timberwolf/10 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-gold-metallic to-amber-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-night truncate">
                      {userData.firstName} {userData.lastName}
                    </p>
                    <p className="text-xs text-night/60 truncate">{userData.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/portal/profile')}
                  className="text-night/70 hover:text-night p-2 rounded-lg hover:bg-timberwolf/10 focus:outline-none focus:ring-2 focus:ring-gold-metallic focus:ring-offset-2"
                >
                  <UserIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Items + Profile & Notifications */}
              <div className="space-y-1">
                {/* Main Navigation */}
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id, item.href)}
                      className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-metallic focus:ring-offset-2 ${
                        isActive
                          ? 'bg-gold-metallic text-white shadow-sm'
                          : 'text-night/80 hover:text-night hover:bg-timberwolf/10'
                      }`}
                      aria-label={item.ariaLabel}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <IconComponent className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-night/70'}`} />
                      <span className="flex-1">{item.label}</span>
                      {isActive && (
                        <div className="w-1 h-4 bg-white rounded-sm"></div>
                      )}
                    </button>
                  );
                })}

                {/* Divider */}
                <div className="my-2 border-t border-timberwolf/20"></div>

                {/* Profile */}
                <button
                  onClick={() => router.push('/portal/profile')}
                  className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-metallic focus:ring-offset-2 ${
                    currentTab === 'profile'
                      ? 'bg-gold-metallic text-white shadow-sm'
                      : 'text-night/80 hover:text-night hover:bg-timberwolf/10'
                  }`}
                >
                  <UserIcon className={`w-4 h-4 flex-shrink-0 ${currentTab === 'profile' ? 'text-white' : 'text-night/70'}`} />
                  <span className="flex-1">Profil</span>
                  {currentTab === 'profile' && (
                    <div className="w-1 h-4 bg-white rounded-sm"></div>
                  )}
                </button>

                {/* Notifications */}
                <button
                  onClick={() => router.push('/portal/notifications')}
                  className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-metallic focus:ring-offset-2 relative ${
                    currentTab === 'notifications'
                      ? 'bg-gold-metallic text-white shadow-sm'
                      : 'text-night/80 hover:text-night hover:bg-timberwolf/10'
                  }`}
                >
                  <BellIcon className={`w-4 h-4 flex-shrink-0 ${currentTab === 'notifications' ? 'text-white' : 'text-night/70'}`} />
                  <span className="flex-1">Notifications</span>
                  {currentTab === 'notifications' && (
                    <div className="w-1 h-4 bg-white rounded-sm"></div>
                  )}
                  <span className="absolute -top-2 -right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                </button>
              </div>

              {/* Mobile Actions */}
              <div className="pt-4 mt-4 border-t border-timberwolf/10 space-y-2">
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <XMarkIcon className="w-4 h-4 mr-2" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
