'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation'
import React from 'react'

export default function Footer() {
    const router = useRouter();
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    // Hide footer on portal pages
    if (pathname.startsWith('/portal') || isAdminPage) {
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
              Votre partenaire de confiance pour l'épargne et l'investissement au Sénégal. 
              Une approche moderne de la finance traditionnelle.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-end gap-4">
              <Image
                src="/everestfin_logo.png"
                alt="Everest Finance Logo"
                width={120}
                height={40}
                className="opacity-90"
              />
              <span className="sama-text-gold text-sm pb-3">
                Agrément n° SGI /DA/2016/60
              </span>
            </div>
          </div>

          {/* Solutions */}
          <div className="flex flex-col sm:flex-row gap-8 pt-8">
            <div>
              <h4 className="font-light mb-4 text-white/90 text-lg">Nos Solutions</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/sama-naffa')} 
                  className="block text-white/60 hover:text-sama-accent-gold transition-all duration-300 text-left font-light hover:translate-x-1"
                >
                  Sama Naffa • Épargne Inclusive
                </button>
                <button 
                  onClick={() => router.push('/ape')} 
                  className="block text-white/60 hover:text-sama-accent-gold transition-all duration-300 text-left font-light hover:translate-x-1"
                >
                  Emprunt Obligataire • Investissement d'État
                </button>
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
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-8">
          <div>
            <h4 className="font-light mb-6 text-white/90 text-lg">Nous Contacter</h4>
            <div className="space-y-4 text-white/60 font-light">
              <div className="group hover:text-sama-accent-gold transition-colors duration-300 cursor-pointer">
                <p className="text-lg">+221 33 822 87 00</p>
                <p className="text-lg">+221 33 822 87 01</p>
              </div>
              <div className="group hover:text-sama-accent-gold transition-colors duration-300 cursor-pointer">
                <p className="text-lg">contact@everestfin.com</p>
              </div>
              <div className="pt-2">
                <p className="text-white/50">18 Boulevard de la République</p>
                <p className="text-white/50">Dakar, Sénégal BP: 11659-13000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 mt-16 pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-white/40 text-sm font-light">
          <p>&copy; {currentYear} Everest Finance. Tous droits réservés.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-sama-accent-gold transition-colors duration-300">Confidentialité</a>
            <a href="#" className="hover:text-sama-accent-gold transition-colors duration-300">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
  )
}