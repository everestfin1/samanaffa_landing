'use client';

import { useRouter } from 'next/navigation';
import { 
  ShieldCheckIcon, 
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

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
          <div className="absolute inset-0">
            <Image
              src="/sama-naffa_bg.jpg"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center pt-20">
            <div className="text-center space-y-16 w-full">
              
              {/* Main heading */}
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-8xl pb-4 text-night font-extralight tracking-tight leading-none">
                  Votre épargne,
                  <br />
                  <span className="bg-gradient-to-r from-gold-dark via-gold-metallic to-gold-dark bg-clip-text text-transparent font-light">
                    notre expertise
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-night/80 max-w-xl mx-auto font-normal leading-relaxed">
                    La plateforme d'épargne et d'investissement de référence au Sénégal.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button 
                  onClick={() => router.push('/register')}
                  className="group relative px-12 py-5 bg-gradient-to-r from-gold-dark to-gold-metallic text-white font-semibold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-gold-metallic/40 hover:-translate-y-1 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-metallic to-gold-light opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">Ouvrir un compte</span>
                </button>
              </div>

            </div>
          </div>
          
          {/* Scroll Down Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <button 
              onClick={() => {
                const servicesSection = document.querySelector('[aria-label="Nos services"]');
                servicesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex flex-col items-center gap-2 text-night/70 hover:text-gold-metallic transition-all duration-300"
              aria-label="Faire défiler vers le bas"
            >
              <span className="text-sm font-light tracking-wide">Découvrir</span>
              <div className="w-8 h-8 border-2 border-night/30 rounded-full flex items-center justify-center group-hover:border-gold-metallic/60 transition-colors duration-300">
                <ChevronDownIcon className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
              </div>
            </button>
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
                      <p className="text-gray-medium text-lg font-light">Épargne Inclusive Moderne</p>
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
                      <h3 className="text-3xl font-light text-night mb-2">Emprunt Obligataire</h3>
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
