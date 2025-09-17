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
  ShieldCheckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { SavingsPlanner } from './SavingsPlanner';
import { useState } from 'react';

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

  const interestRates = [
    { duration: "≤ 6 mois", rate: "3.5%" },
    { duration: "≤ 12 mois", rate: "4.5%" },
    { duration: "≤ 36 mois", rate: "6.0%" },
    { duration: "≤ 60 mois", rate: "7.0%" },
    { duration: "≤ 120 mois", rate: "8.5%" },
    { duration: "> 120 mois", rate: "10.0%" }
  ];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center py-12 lg:py-20 px-4 rounded-2xl p-8 bg-white">
        <h1 className="font-bold text-[#01081b] text-2xl lg:text-[38px] leading-tight mb-4">
          Sama Naffa
          <span className="text-[#C38D1C] block mt-2">Plateforme d'Épargne Digitale</span>
        </h1>
        <p className="text-gray-600 text-base lg:text-lg max-w-4xl mx-auto mb-8">
          Révolutionnez vos habitudes d'épargne avec la première plateforme financière
          conçue spécifiquement pour l'Afrique de l'Ouest. Une solution moderne,
          culturellement pertinente et technologiquement avancée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="group px-8 py-6 flex items-center justify-center bg-gradient-to-br from-[#e8f5e8] to-[#d4f4d4] rounded-2xl text-[#435933] font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-[#435933]/50 h-[50px] lg:h-[60px]">
            Commencer mon épargne
          </button>
          <button className="group px-8 py-6 flex items-center justify-center bg-white rounded-2xl text-[#01081b] font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-gray-200 hover:border-[#435933]/50 h-[50px] lg:h-[60px]">
            Découvrir les fonctionnalités
          </button>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="mb-16 py-12 lg:py-20 px-4 rounded-2xl p-8 bg-white">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-bold text-[#01081b] text-2xl lg:text-[38px] leading-tight mb-6">Notre Mission</h2>
            <p className="text-gray-600 text-base lg:text-lg mb-6">
              Démocratiser l'épargne digitale en Afrique de l'Ouest en rendant la planification
              financière accessible, pertinente et engageante pour tous les segments d'utilisateurs,
              quel que soit leur niveau de revenus, leur profession ou leur contexte culturel.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-[#435933] flex-shrink-0" />
                <span className="text-[#01081b]/80">Inclusion financière pour tous</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-[#435933] flex-shrink-0" />
                <span className="text-[#01081b]/80">Respect des pratiques culturelles</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-[#435933] flex-shrink-0" />
                <span className="text-[#01081b]/80">Innovation technologique adaptée</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#e8f5e8] to-[#d4f4d4] rounded-2xl p-8">
            <h3 className="text-xl lg:text-2xl font-bold text-[#435933] mb-4">Notre Vision</h3>
            <p className="text-[#01081b]/70 text-base lg:text-lg">
              Devenir la plateforme d'épargne digitale de référence en Afrique de l'Ouest,
              en autonomisant les individus et les communautés pour qu'ils atteignent leurs
              objectifs financiers grâce à une technologie innovante et des produits
              financiers culturellement appropriés.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="mb-16 py-12 lg:py-20 px-4 rounded-2xl p-8 bg-white">
        <h2 className="font-bold text-[#01081b] text-2xl lg:text-[38px] leading-tight text-center mb-12">
          Fonctionnalités Principales
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow group hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-[#e8f5e8] to-[#d4f4d4] rounded-lg flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-[#d4f4d4] group-hover:to-[#c8f0c8]">
                <feature.icon className="w-6 h-6 text-[#435933]" />
              </div>
              <h3 className="text-lg font-semibold text-[#01081b] mb-3">{feature.title}</h3>
              <p className="text-[#01081b]/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Savings Planner Section */}
      <SavingsPlanner onShowForm={handleShowForm} />

      {/* Form Display Section */}
      {showForm && formData && (
        <section className="mb-16 py-12 lg:py-20 px-4 rounded-2xl p-8 bg-white">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl lg:text-2xl font-bold text-[#01081b] mb-6 text-center">
              Récapitulatif de votre plan d'épargne
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#435933]/10 to-[#C38D1C]/10 rounded-lg border border-[#435933]/20">
                <span className="font-medium text-[#01081b]">Objectif:</span>
                <span className="text-[#01081b]/70">{formData.objective}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#435933]/10 to-[#C38D1C]/10 rounded-lg border border-[#435933]/20">
                <span className="font-medium text-[#01081b]">Montant mensuel:</span>
                <span className="text-[#01081b]/70">{formData.monthlyAmount.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#435933]/10 to-[#C38D1C]/10 rounded-lg border border-[#435933]/20">
                <span className="font-medium text-[#01081b]">Durée:</span>
                <span className="text-[#01081b]/70">{formData.duration} ans</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#435933]/10 to-[#C38D1C]/10 rounded-lg border border-[#435933]/20">
                <span className="font-bold text-[#01081b]">Capital final estimé:</span>
                <span className="font-bold text-[#C38D1C] text-lg">{formData.projectedAmount.toLocaleString()} FCFA</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowForm(false)}
                className="bg-white text-[#01081b] px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors mr-4 border border-gray-200 h-[50px] lg:h-[60px]"
              >
                Modifier le plan
              </button>
              <button className="group relative px-6 lg:px-8 h-[50px] lg:h-[60px] bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] rounded-xl lg:rounded-2xl text-white text-base lg:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 lg:gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden w-full sm:w-auto max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10">Commencer maintenant</span>
                <svg
                  width="20"
                  height="6"
                  viewBox="0 0 24 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 hidden sm:block"
                >
                  <path
                    d="M23.3536 4.35355C23.5488 4.15829 23.5488 3.84171 23.3536 3.64645L20.1716 0.464466C19.9763 0.269204 19.6597 0.269204 19.4645 0.464466C19.2692 0.659728 19.2692 0.976311 19.4645 1.17157L22.2929 4L19.4645 6.82843C19.2692 7.02369 19.2692 7.34027 19.4645 7.53553C19.6597 7.7308 19.9763 7.7308 20.1716 7.53553L23.3536 4.35355ZM0 4.5H23V3.5H0V4.5Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="text-center mb-16">
        <div className="bg-gradient-to-br from-[#e8f5e8] to-[#d4f4d4] rounded-2xl p-12">
          <h2 className="font-bold text-[#01081b] text-2xl lg:text-[38px] leading-tight mb-6">
            Prêt à Transformer Votre Épargne ?
          </h2>
          <p className="text-[#01081b]/70 text-base lg:text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à Sama Naffa
            pour atteindre leurs objectifs financiers. Commencez votre parcours
            d'épargne intelligente dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-6 lg:px-8 h-[50px] lg:h-[60px] bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] rounded-xl lg:rounded-2xl text-white text-base lg:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 lg:gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden w-full sm:w-auto max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10">Créer mon compte</span>
              <svg
                width="20"
                height="6"
                viewBox="0 0 24 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 hidden sm:block"
              >
                <path
                  d="M23.3536 4.35355C23.5488 4.15829 23.5488 .84171 23.3536 3.64645L20.1716 0.464466C19.9763 0.269204 19.6597 0.269204 19.4645 0.464466C19.2692 0.659728 19.2692 0.976311 19.4645 1.17157L22.2929 4L19.4645 6.82843C19.2692 7.02369 19.2692 7.34027 19.4645 7.53553C19.6597 7.7308 19.9763 7.7308 20.1716 7.53553L23.3536 4.35355ZM0 4.5H23V3.5H0V4.5Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button className="group px-8 py-6 flex items-center justify-center bg-white rounded-2xl text-[#01081b] font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-gray-200 hover:border-[#435933]/50 h-[50px] lg:h-[60px]">
              En savoir plus
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
