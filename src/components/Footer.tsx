'use client'

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'
import React from 'react'
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { CREPMF_AGREMENT_LINE } from '@/lib/compliance-copy';

export default function Footer() {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    const isApePage = pathname.startsWith('/apesenegal') || pathname.startsWith('/ape');
    const isPeePage = pathname.startsWith('/pee');
    // Hide footer on portal pages, admin pages, and APE Senegal pages (APE has its own footer)
    if (pathname.startsWith('/portal') || isAdminPage || isApePage || isPeePage) {
        return null;
    }
    const currentYear = new Date().getFullYear();
  return (
    <footer className="relative sama-bg-secondary text-white py-24">
    {/* Subtle gradient overlay */}
    {/* <div className="absolute inset-0 bg-gradient-to-t from-sama-secondary-green via-sama-secondary-green to-sama-secondary-green/95"></div> */}
    
    <div className="relative max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-3 gap-16 items-start">
        {/* Brand Section */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="mb-6">
              <Image
                src="/sama_naffa_logo.png"
                alt="Sama Naffa Logo"
                width={250}
                height={80}
              />
            </div>
            <p className="text-white/70 text-xl font-light leading-relaxed max-w-2xl">
              Nous plaçons et gérons votre épargne en obligations de l&apos;État, selon vos objectifs.
            </p>
          </div>

          {/* Solutions */}
          <div className="flex flex-col sm:flex-row gap-8 pt-8">
            <div>
              <h4 className="font-light mb-4 text-white/90 text-lg">Nos Solutions</h4>
              <div className="space-y-3">
                <Link
                  href="/sama-naffa"
                  className="block text-white/60 hover:text-sama-accent-gold transition-all duration-300 text-left font-light hover:translate-x-1"
                >
                  SAMA NAFFA • Votre épargne gérée
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-light mb-4 text-white/90 text-lg">Support</h4>
              <div className="space-y-3">
                <Link 
                  href="/faq"
                  className="flex items-center space-x-3 text-white/60 hover:text-sama-accent-gold transition-all duration-300 font-light hover:translate-x-1"
                >
                  <span>FAQ</span>
                </Link>
                <Link 
                  href="/contact"
                  className="flex items-center space-x-3 text-white/60 hover:text-sama-accent-gold transition-all duration-300 font-light hover:translate-x-1"
                >
                  <span>Contact</span>
                </Link>
                <Link 
                  href="/contact"
                  className="flex items-center space-x-3 text-white/60 hover:text-sama-accent-gold transition-all duration-300 font-light hover:translate-x-1"
                >
                  <span>Réclamations</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-8">
          {/* Everest Finance Logo and Agrément */}
          <div className="flex flex-col gap-3">
            <Image
              src="/everestfin_logo.png"
              alt="Everest Finance Logo"
              width={120}
              height={40}
              className="opacity-90"
            />
            <span className="text-sm text-white/60 font-light">
              {CREPMF_AGREMENT_LINE}
            </span>
          </div>

          <div>
            <h4 className="font-light mb-6 text-white/90 text-lg">Nous Contacter</h4>
            <div className="space-y-4 text-white/60 font-light">
              <div className="group hover:text-sama-accent-gold transition-colors duration-300 cursor-pointer flex gap-3">
                <PhoneIcon className="w-5 h-5 mt-1" />
                <p className="text-lg mb-0 leading-none">+221 33 822 87 00</p>
              </div>
              <div className="group hover:text-sama-accent-gold transition-colors duration-300 cursor-pointer flex gap-3">
                <EnvelopeIcon className="w-5 h-5 mt-1" />
                <p className="text-lg mb-0 leading-none">contact@everestfin.com</p>
              </div>
              <div className="pt-2 flex gap-3">
                <MapPinIcon className="w-5 h-5 mt-1" />
                <div>
                  <p className="text-white/50 mb-0 leading-none">18 Boulevard de la République</p>
                  <p className="text-white/50 mb-0 leading-none">Dakar, Sénégal BP: 11659-13000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 mt-16 pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-white/40 text-sm font-light">
          <p>&copy; {currentYear} EVEREST FINANCE SA</p>
          <div className="flex gap-8 flex-wrap justify-center sm:justify-end">
            <Link href="/privacy" className="hover:text-sama-accent-gold transition-colors duration-300">Confidentialité</Link>
            <Link href="/terms" className="hover:text-sama-accent-gold transition-colors duration-300">CGU</Link>
            <Link href="/cookies" className="hover:text-sama-accent-gold transition-colors duration-300">Cookies</Link>
            <Link href="/faq" className="hover:text-sama-accent-gold transition-colors duration-300">FAQ</Link>
            <Link href="/contact" className="hover:text-sama-accent-gold transition-colors duration-300">Contact</Link>
            <Link href="/contact" className="hover:text-sama-accent-gold transition-colors duration-300">Réclamations</Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
  )
}