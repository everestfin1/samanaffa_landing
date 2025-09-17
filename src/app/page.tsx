'use client';

import { useRouter } from 'next/navigation';
import { 
  ShieldCheckIcon, 
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  ArrowRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Skip to content */}
      <a href="#main" className="skip-link">Aller au contenu principal</a>

      {/* Hero Section */}
      <main id="main">
        <section className="relative overflow-hidden bg-white h-screen -mt-20" aria-label="Hero">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/bg_image.jpg)',
            }}
          ></div>
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-night/60 via-night/40 to-night/70"></div>
          
          {/* Subtle metallic accent overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold-metallic/5 via-transparent to-gold-metallic/10"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center pt-20">
            <div className="text-center space-y-16 w-full">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-lg border border-gold-metallic/40 rounded-full text-base font-medium shadow-2xl hover:bg-white/15 transition-all duration-300">
                <div className="relative">
                  <ShieldCheckIcon className="w-6 h-6 text-gold-metallic drop-shadow-sm" />
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-gold-metallic to-gold-light rounded-full opacity-75 animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-gradient-to-r from-gold-light via-gold-metallic to-gold-light bg-clip-text text-transparent font-bold tracking-wide">
                    Conforme BCEAO
                  </span>
                  <span className="text-white/60 text-sm">•</span>
                  <span className="text-white/90 font-light">Sécurisé et Réglementé</span>
                </div>
              </div>

              {/* Main heading */}
              <div className="space-y-8">
                <h1 className="text-6xl lg:text-8xl text-white font-extralight tracking-tight leading-none drop-shadow-2xl">
                  Votre épargne,
                  <br />
                  <span className="bg-gradient-to-r from-gold-light via-gold-metallic to-gold-light bg-clip-text text-transparent font-light">
                    notre expertise
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto font-light leading-relaxed drop-shadow-lg">
                  La plateforme d'épargne et d'investissement de référence au Sénégal.
                  <br className="hidden lg:block" />
                  Transformez vos objectifs financiers en réalité.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button 
                  onClick={() => router.push('/sama-naffa')}
                  className="group relative px-12 py-5 bg-gradient-to-r from-gold-dark to-gold-metallic text-night font-semibold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-gold-metallic/40 hover:-translate-y-1 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-metallic to-gold-light opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">Commencer maintenant</span>
                </button>
                <button 
                  onClick={() => router.push('/ape')}
                  className="group px-12 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-semibold text-lg rounded-2xl hover:bg-white/20 hover:border-gold-metallic/50 transition-all duration-300 hover:shadow-xl"
                >
                  <span className="group-hover:text-gold-light transition-colors">Explorer l'APE</span>
                </button>
              </div>

              {/* Social proof */}
              <div className="flex justify-center items-center gap-16 pb-20">
                <div className="text-center group">
                  <div className="text-4xl lg:text-5xl font-extralight text-white mb-2 group-hover:text-gold-metallic transition-colors drop-shadow-lg">10,000+</div>
                  <div className="text-sm text-white/70 uppercase tracking-wider">Clients</div>
                </div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                <div className="text-center group">
                  <div className="text-4xl lg:text-5xl font-extralight text-white mb-2 group-hover:text-gold-metallic transition-colors drop-shadow-lg">8%</div>
                  <div className="text-sm text-white/70 uppercase tracking-wider">Rendement APE</div>
                </div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                <div className="text-center group">
                  <div className="text-4xl lg:text-5xl font-extralight text-white mb-2 group-hover:text-gold-metallic transition-colors drop-shadow-lg">24/7</div>
                  <div className="text-sm text-white/70 uppercase tracking-wider">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-32 bg-gradient-to-br from-white via-white-smoke to-gold-light/30" aria-label="Nos services">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl lg:text-6xl text-night font-extralight mb-6 tracking-tight">
                Deux solutions,
                <span className="block bg-gradient-to-r from-gold-dark to-gold-metallic bg-clip-text text-transparent font-light">
                  un objectif
                </span>
              </h2>
              <p className="text-xl text-gray-medium font-light max-w-2xl mx-auto">
                Choisissez la solution qui correspond parfaitement à vos ambitions financières
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              {/* Sama Naffa Card */}
              <div className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-10 border border-gold-metallic/10 hover:border-gold-metallic/30 transition-all duration-700 hover:shadow-2xl hover:shadow-gold-metallic/10 hover:-translate-y-2">
                {/* Subtle gold accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-dark to-gold-metallic rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-gold-metallic/10 to-gold-metallic/5 rounded-3xl flex items-center justify-center group-hover:from-gold-metallic/20 group-hover:to-gold-metallic/10 transition-all duration-300">
                        <DevicePhoneMobileIcon className="w-8 h-8 text-gold-metallic" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-gold-dark to-gold-metallic rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-light text-night mb-2">Sama Naffa</h3>
                      <p className="text-gray-medium text-lg font-light">Banque Digitale Moderne</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-dark leading-relaxed text-lg font-light">
                    Épargne intelligente avec objectifs personnalisés, comptes joints et défis d'épargne communautaires pour une gestion financière moderne.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-gold-dark to-gold-metallic rounded-full"></div>
                      <span className="text-gray-dark font-light">Objectifs d'épargne personnalisés</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-gold-dark to-gold-metallic rounded-full"></div>
                      <span className="text-gray-dark font-light">Comptes joints et tontines digitales</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-gold-dark to-gold-metallic rounded-full"></div>
                      <span className="text-gray-dark font-light">Défis d'épargne motivants</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/sama-naffa"
                    className="inline-flex items-center gap-3 text-night font-medium hover:text-gold-metallic transition-all duration-300 group/link pt-4"
                  >
                    <span className="text-lg">Découvrir Sama Naffa</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover/link:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

              {/* APE Card */}
              <div className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-10 border border-gold-metallic/10 hover:border-gold-metallic/30 transition-all duration-700 hover:shadow-2xl hover:shadow-gold-metallic/10 hover:-translate-y-2">
                {/* Subtle gold accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-dark to-gold-metallic rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-gold-metallic/10 to-gold-metallic/5 rounded-3xl flex items-center justify-center group-hover:from-gold-metallic/20 group-hover:to-gold-metallic/10 transition-all duration-300">
                        <BuildingLibraryIcon className="w-8 h-8 text-gold-metallic" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-gold-dark to-gold-metallic rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-light text-night mb-2">APE Sénégal</h3>
                      <p className="text-gray-medium text-lg font-light">Appel Public à l'Épargne</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-dark leading-relaxed text-lg font-light">
                    Investissement sécurisé dans les obligations d'État avec rendement fixe garanti et échéances définies pour une croissance stable.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-gold-dark to-gold-metallic rounded-full"></div>
                      <span className="text-gray-dark font-light">Rendement fixe garanti de 8%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-gold-dark to-gold-metallic rounded-full"></div>
                      <span className="text-gray-dark font-light">Sécurisé par l'État du Sénégal</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-gold-dark to-gold-metallic rounded-full"></div>
                      <span className="text-gray-dark font-light">Calculateur de rendement intégré</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/ape"
                    className="inline-flex items-center gap-3 text-night font-medium hover:text-gold-metallic transition-all duration-300 group/link pt-4"
                  >
                    <span className="text-lg">Explorer l'APE</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover/link:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
