'use client';

import {
  WalletIcon,
  BanknotesIcon,
  UserGroupIcon,
  TrophyIcon,
  ChartBarIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { SavingsPlanner } from './SavingsPlanner';
import { useState } from 'react';
import Image from 'next/image';

interface FormSubmissionData {
  objective: string;
  monthlyAmount: number;
  duration: number;
  projectedAmount: number;
}

export default function SamaNaffa() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormSubmissionData | null>(null);

  const handleShowForm = (data: FormSubmissionData) => {
    setFormData(data);
    setShowForm(true);
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Skip to content */}
      <a href="#main" className="skip-link">Aller au contenu principal</a>
      
      {/* Header Section - With Background Image */}
      <main id="main">
        <section className="relative pt-32 pb-20 overflow-hidden" aria-label="Sama Naffa Header">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/sama-naffa_bg_1.webp"
              alt="Sama Naffa - Épargne Intelligente pour l'Afrique de l'Ouest"
              fill
              className="object-cover object-center"
              priority
              quality={90}
            />
          </div>

          {/* Enhanced dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/80 to-white/30 "></div>
          
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-lg border border-white/40 rounded-full text-sm font-medium mb-6 shadow-2xl">
                <DevicePhoneMobileIcon className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">
                  Banque Digitale Moderne
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl text-white font-light tracking-tight mb-6 drop-shadow-2xl">
                Sama Naffa
                <span className="block text-2xl lg:text-3xl text-white/95 font-light mt-2">
                  Épargne Intelligente pour l'Afrique de l'Ouest
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-white/95 font-light max-w-3xl mx-auto mb-12 drop-shadow-lg">
                Révolutionnez vos habitudes d'épargne avec des outils modernes
                adaptés à la culture financière sénégalaise.
              </p>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/25 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-2xl hover:bg-white/30 hover:shadow-3xl transition-all duration-300">
                  <div className="text-3xl font-light text-white mb-2">10%</div>
                  <div className="text-sm text-white/95 font-medium">Rendement Maximum</div>
                </div>
                <div className="bg-white/25 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-2xl hover:bg-white/30 hover:shadow-3xl transition-all duration-300">
                  <div className="text-3xl font-light text-white mb-2">1,000</div>
                  <div className="text-sm text-white/95 font-medium">FCFA Minimum</div>
                </div>
                <div className="bg-white/25 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-2xl hover:bg-white/30 hover:shadow-3xl transition-all duration-300">
                  <div className="text-3xl font-light text-white mb-2">24/7</div>
                  <div className="text-sm text-white/95 font-medium">Accès Mobile</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid - Horizontal Layout */}
        <section className="py-16 bg-gray-50" aria-label="Fonctionnalités principales">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl text-night font-light mb-4 tracking-tight">
                Fonctionnalités Principales
              </h2>
              <p className="text-lg text-gray-medium font-light max-w-2xl mx-auto">
                Des outils modernes pour une épargne intelligente et culturellement adaptée
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gold-metallic/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gold-metallic/10 rounded-xl flex items-center justify-center">
                        <feature.icon className="w-7 h-7 text-gold-metallic" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-night mb-3">{feature.title}</h3>
                      <p className="text-gray-dark leading-relaxed font-light">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* Savings Planner Section */}
      <SavingsPlanner onShowForm={handleShowForm} />

        {/* Form Display Section */}
        {showForm && formData && (
          <section className="py-16 bg-white">
            <div className="max-w-2xl mx-auto px-6">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                <h3 className="text-2xl font-medium text-night mb-6 text-center">
                  Récapitulatif de votre plan d'épargne
                </h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-4 bg-gold-metallic/5 rounded-lg border border-gold-metallic/20">
                    <span className="font-medium text-night">Objectif:</span>
                    <span className="text-gray-dark">{formData.objective}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gold-metallic/5 rounded-lg border border-gold-metallic/20">
                    <span className="font-medium text-night">Montant mensuel:</span>
                    <span className="text-gray-dark">{formData.monthlyAmount.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gold-metallic/5 rounded-lg border border-gold-metallic/20">
                    <span className="font-medium text-night">Durée:</span>
                    <span className="text-gray-dark">{formData.duration} ans</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gold-metallic/5 rounded-lg border border-gold-metallic/20">
                    <span className="font-bold text-night">Capital final estimé:</span>
                    <span className="font-bold text-gold-metallic text-lg">{formData.projectedAmount.toLocaleString()} FCFA</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-100 text-night font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Modifier le plan
                  </button>
                  <button className="px-8 py-3 bg-gradient-to-r from-gold-dark to-gold-metallic text-night font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                    Commencer maintenant
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Simple Call to Action */}
        <section className="py-16 bg-gradient-to-br from-gold-metallic/5 to-gold-light/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-4xl text-night font-light mb-4">
              Prêt à Commencer Votre Épargne ?
            </h2>
            <p className="text-lg text-gray-medium font-light mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui transforment leur avenir financier avec Sama Naffa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-gold-dark to-gold-metallic text-night font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                <span className="flex items-center justify-center">
                  Créer mon compte
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </span>
              </button>
              <button className="px-8 py-4 bg-white border border-gold-metallic/30 text-night font-medium rounded-xl hover:bg-gold-metallic/5 transition-all duration-300">
                En savoir plus
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
