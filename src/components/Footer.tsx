'use client'
import { ShieldCheckIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Footer() {
    const router = useRouter();
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
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm border border-gold-metallic/20 rounded-full text-sm text-white/80">
              <ShieldCheckIcon className="w-4 h-4 text-gold-metallic" />
              <span className="bg-gradient-to-r from-gold-metallic to-gold-light bg-clip-text text-transparent font-medium">
                Conforme BCEAO
              </span>
            </div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm border border-gold-metallic/20 rounded-full text-sm text-white/80">
              <div className="w-2 h-2 bg-gradient-to-r from-gold-metallic to-gold-light rounded-full"></div>
              <span>Sécurisé et Réglementé</span>
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
          <p>&copy; 2024 Sama Naffa. Tous droits réservés.</p>
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