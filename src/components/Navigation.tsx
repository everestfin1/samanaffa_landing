'use client';

import { useState } from 'react';
import { 
  Bars3Icon,
  XMarkIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface NavigationProps {
  activeTab?: 'sama-naffa' | 'ape' | 'home';
  onTabChange?: (tab: 'sama-naffa' | 'ape' | 'home') => void;
  isAuthenticated?: boolean;
}

export default function Navigation({ 
  activeTab = 'home', 
  onTabChange,
  isAuthenticated = false 
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: 'sama-naffa' | 'ape' | 'home') => {
    onTabChange?.(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/95 border-b border-timberwolf/20 sticky top-0 z-50 backdrop-blur-sm" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button 
                onClick={() => handleTabClick('home')}
                className="text-2xl font-bold text-night hover:text-gold-metallic transition-colors"
              >
                Sama Naffa
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Main Navigation Tabs */}
            <div className="flex items-center space-x-1 bg-timberwolf/20 rounded-lg p-1">
              <button
                onClick={() => handleTabClick('home')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'home'
                    ? 'bg-white text-night shadow-sm'
                    : 'text-night/70 hover:text-night hover:bg-white/50'
                }`}
              >
                Accueil
              </button>
              <button
                onClick={() => handleTabClick('sama-naffa')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'sama-naffa'
                    ? 'bg-white text-night shadow-sm'
                    : 'text-night/70 hover:text-night hover:bg-white/50'
                }`}
              >
                <DevicePhoneMobileIcon className="w-4 h-4" />
                <span>Sama Naffa</span>
              </button>
              <button
                onClick={() => handleTabClick('ape')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'ape'
                    ? 'bg-white text-night shadow-sm'
                    : 'text-night/70 hover:text-night hover:bg-white/50'
                }`}
              >
                <BuildingLibraryIcon className="w-4 h-4" />
                <span>APE Sénégal</span>
              </button>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4 ml-6">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 text-night/70 hover:text-night transition-colors">
                    <UserIcon className="w-5 h-5" />
                    <span className="text-sm">Mon Portail</span>
                  </button>
                  <button className="bg-gold-metallic text-night px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gold-metallic/90 transition-colors">
                    Tableau de bord
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button className="text-night/70 hover:text-night transition-colors text-sm font-medium">
                    Se connecter
                  </button>
                  <button className="bg-gold-metallic text-night px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gold-metallic/90 transition-colors">
                    Commencer
                  </button>
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
              <button
                onClick={() => handleTabClick('home')}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  activeTab === 'home'
                    ? 'bg-gold-metallic/10 text-night'
                    : 'text-night/70 hover:text-night hover:bg-timberwolf/20'
                }`}
              >
                Accueil
              </button>
              <button
                onClick={() => handleTabClick('sama-naffa')}
                className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  activeTab === 'sama-naffa'
                    ? 'bg-gold-metallic/10 text-night'
                    : 'text-night/70 hover:text-night hover:bg-timberwolf/20'
                }`}
              >
                <DevicePhoneMobileIcon className="w-5 h-5" />
                <span>Sama Naffa (Banque Digitale)</span>
              </button>
              <button
                onClick={() => handleTabClick('ape')}
                className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  activeTab === 'ape'
                    ? 'bg-gold-metallic/10 text-night'
                    : 'text-night/70 hover:text-night hover:bg-timberwolf/20'
                }`}
              >
                <BuildingLibraryIcon className="w-5 h-5" />
                <span>APE Sénégal</span>
              </button>
            </div>
            <div className="border-t border-timberwolf/20 px-2 pt-3 pb-3">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <button className="flex items-center space-x-2 w-full text-left px-3 py-2 text-night/70 hover:text-night transition-colors">
                    <UserIcon className="w-5 h-5" />
                    <span>Mon Portail</span>
                  </button>
                  <button className="w-full bg-gold-metallic text-night px-4 py-2 rounded-lg font-semibold hover:bg-gold-metallic/90 transition-colors">
                    Tableau de bord
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-night/70 hover:text-night transition-colors font-medium">
                    Se connecter
                  </button>
                  <button className="w-full bg-gold-metallic text-night px-4 py-2 rounded-lg font-semibold hover:bg-gold-metallic/90 transition-colors">
                    Commencer
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
