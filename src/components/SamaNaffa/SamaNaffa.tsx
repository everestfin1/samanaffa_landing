'use client';

import {
  WalletIcon,
  BanknotesIcon,
  UserGroupIcon,
  TrophyIcon,
  ChartBarIcon,
  StarIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { SavingsPlanner } from './SavingsPlanner';
import { useRef } from 'react';
import Image from 'next/image';

export default function SamaNaffa() {
  // Refs for scrolling
  const plannerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: WalletIcon,
      title: "Portefeuille Digital",
      description: "Gérez vos finances avec un portefeuille mobile sécurisé, optimisé pour les transactions quotidiennes au Sénégal."
    },
    {
      icon: BanknotesIcon,
      title: "Épargne Intelligente",
      description: "Planifiez vos objectifs financiers avec des taux d'intérêt attractifs et des simulations personnalisées."
    },
    {
      icon: UserGroupIcon,
      title: "Tontines Modernes",
      description: "Digitalisez vos tontines traditionnelles avec une gestion transparente et sécurisée."
    },
    {
      icon: TrophyIcon,
      title: "Défis Financiers",
      description: "Participez à des challenges d'épargne ludiques pour atteindre vos objectifs plus rapidement."
    }
  ];

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <main id="main">
        <section className="relative pt-32 pb-20 overflow-hidden max-h-[50vh] flex items-center" aria-label="Sama Naffa Hero">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/sama-naffa-banner.png"
              alt="Sama Naffa - Épargne Intelligente pour l'Afrique de l'Ouest"
              fill
              className="object-cover object-center"
              priority
              quality={90}
            />
          </div>

          {/* Enhanced gradient overlay with brand colors */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-sama-accent-gold/20 to-sama-primary-green/20"></div> */}
          
          <div className="relative max-w-7xl mx-auto px-6 w-full">
            <div className="text-center max-w-5xl mx-auto">
              <h1 className="sama-heading-hero text-white mb-6 tracking-tight">
                Sama Naffa
                <span className="block text-2xl lg:text-4xl max-w-[600px] mx-auto sama-text-gold font-medium mt-3">
                  Épargne Intelligente pour l'Afrique de l'Ouest
                </span>
              </h1>
            </div>
          </div>
        </section>
        {/* Features Grid - Enhanced Layout */}
        <section className="py-20" aria-label="Fonctionnalités principales">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="sama-heading-section mb-6">
                Fonctionnalités Principales
              </h2>
              <p className="sama-body-large max-w-3xl mx-auto">
                Des outils modernes pour une épargne intelligente et culturellement adaptée
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {features.map((feature, index) => (
                <div key={index} className="sama-card-feature group">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#435933] to-[#30461f] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="sama-heading-card mb-4">{feature.title}</h3>
                      <p className="sama-body-regular leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Trust Indicators */}
            <div className="mt-16 text-center">
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-[#435933]" />
                  <span className="sama-body-small">Sécurisé & Régulé</span>
                </div>
                <div className="flex items-center gap-2">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-[#435933]" />
                  <span className="sama-body-small">Mobile First</span>
                </div>
                <div className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5 text-[#C38D1C]" />
                  <span className="sama-body-small">Taux Préférentiels</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Savings Planner Section - Moved under hero */}
        <div ref={plannerRef}>
          <SavingsPlanner />
        </div>


      </main>
    </div>
  );
}
