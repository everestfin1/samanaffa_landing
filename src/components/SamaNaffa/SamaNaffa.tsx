'use client';

import {
  WalletIcon,
  BanknotesIcon,
  ChartBarIcon,
  StarIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { SavingsPlanner } from './SavingsPlanner';
import { useRef } from 'react';
import Image from 'next/image';
import RiskDisclaimer from '@/components/compliance/RiskDisclaimer';

export default function SamaNaffa() {
  const plannerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: WalletIcon,
      title: 'Votre Naffa',
      description:
        'Suivez votre épargne et sa valeur, à tout moment. Ce n\'est pas un porte-monnaie de paiement — c\'est une épargne gérée pour votre compte.',
    },
    {
      icon: BanknotesIcon,
      title: 'Objectifs personnalisés',
      description:
        'Fixez vos objectifs ; nous investissons votre épargne en obligations de l\'État, avec un objectif de rendement.',
    },
    {
      icon: ChartBarIcon,
      title: 'Simulations',
      description:
        'Estimez l\'évolution de votre épargne avec notre simulateur. Objectif de rendement non garanti.',
    },
  ];

  return (
    <div className="min-h-screen">
      <main id="main">
        <section className="relative pt-32 pb-20 overflow-hidden max-h-[50vh] flex items-center" aria-label="Sama Naffa Hero">
          <div className="absolute inset-0">
            <Image
              src="/sama-naffa-banner.png"
              alt="Sama Naffa — Nous faisons fructifier votre épargne"
              fill
              className="object-cover object-center"
              priority
              quality={90}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 w-full">
            <div className="text-center max-w-5xl mx-auto">
              <h1 className="sama-heading-hero text-white mb-6 tracking-tight">
                Sama Naffa
                <span className="block text-2xl lg:text-4xl max-w-[600px] mx-auto sama-text-gold font-medium mt-3">
                  Nous faisons fructifier votre épargne
                </span>
              </h1>
            </div>
          </div>
        </section>

        <section className="py-20" aria-label="Fonctionnalités principales">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="sama-heading-section mb-6">
                Fonctionnalités Principales
              </h2>
              <p className="sama-body-large max-w-3xl mx-auto">
                Des outils simples pour suivre votre épargne gérée sous mandat
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {features.map((feature, index) => (
                <div key={index} className="sama-card-feature group">
                  <div className="flex flex-col items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#435933] to-[#30461f] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="sama-heading-card mb-4">{feature.title}</h3>
                      <p className="sama-body-regular leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 max-w-2xl mx-auto">
              <RiskDisclaimer className="text-center" />
            </div>

            <div className="mt-16 text-center">
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-[#435933]" />
                  <span className="sama-body-small">Agréé et régulé (CREPMF)</span>
                </div>
                <div className="flex items-center gap-2">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-[#435933]" />
                  <span className="sama-body-small">Mobile First</span>
                </div>
                <div className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5 text-[#C38D1C]" />
                  <span className="sama-body-small">Obligations de l&apos;État</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div ref={plannerRef}>
          <SavingsPlanner />
        </div>
      </main>
    </div>
  );
}
