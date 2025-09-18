'use client'
import { ShieldCheckIcon } from 'lucide-react'
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'
import React from 'react'

export default function Footer() {
    const router = useRouter();
    const pathname = usePathname();

    // Hide footer on portal pages
    if (pathname.startsWith('/portal')) {
        return null;
    }
  return (
    <footer className="relative bg-night text-white py-24">
    {/* Subtle gold gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-night via-night to-night/95"></div>
    
    <div className="relative max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-3 gap-16 items-start">
        {/* Brand Section */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-4xl font-extralight mb-4">
              <span className="bg-gradient-to-r from-gold-metallic via-gold-light to-gold-metallic bg-clip-text text-transparent">
                Sama Naffa
              </span>
            </h3>
            <p className="text-white/70 text-xl font-light leading-relaxed max-w-2xl">
              Votre partenaire de confiance pour l'épargne et l'investissement au Sénégal. 
              Une approche moderne de la finance traditionnelle.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-sm font-medium shadow-xl">
                <span className="text-white/70">Opéré par</span>
                <Link href="https://everest-new.vercel.app" target="_blank" className="hover:text-gold-metallic transition-colors duration-300">
                <span className="bg-gradient-to-r from-gold-light via-gold-metallic to-gold-light bg-clip-text text-transparent font-semibold tracking-wide">
                  Everest Finance SGI
                </span>
                </Link>
              </div>
          </div>

          {/* Solutions */}
          <div className="flex flex-col sm:flex-row gap-8 pt-8">
            <div>
              <h4 className="font-light mb-4 text-white/90 text-lg">Nos Solutions</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/sama-naffa')} 
                  className="block text-white/60 hover:text-gold-metallic transition-all duration-300 text-left font-light hover:translate-x-1"
                >
                  Sama Naffa • Banque Digitale
                </button>
                <button 
                  onClick={() => router.push('/ape')} 
                  className="block text-white/60 hover:text-gold-metallic transition-all duration-300 text-left font-light hover:translate-x-1"
                >
                  APE Sénégal • Investissement d'État
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-8">
          <div>
            <h4 className="font-light mb-6 text-white/90 text-lg">Nous Contacter</h4>
            <div className="space-y-4 text-white/60 font-light">
              <div className="group hover:text-gold-metallic transition-colors duration-300 cursor-pointer">
                <p className="text-lg">+221 33 XXX XX XX</p>
              </div>
              <div className="group hover:text-gold-metallic transition-colors duration-300 cursor-pointer">
                <p className="text-lg">contact@samanaffa.sn</p>
              </div>
              <div className="pt-2">
                <p className="text-white/50">Dakar, Sénégal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 mt-16 pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-white/40 text-sm font-light">
          <p>&copy; 2025 Sama Naffa. Tous droits réservés.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-gold-metallic transition-colors duration-300">Confidentialité</a>
            <a href="#" className="hover:text-gold-metallic transition-colors duration-300">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
  )
}