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
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelection } from '../../lib/selection-context';
import Image from 'next/image';

interface FormSubmissionData {
  objective: string;
  monthlyAmount: number;
  duration: number;
  projectedAmount: number;
  simulationMode: 'objective' | 'persona';
  selectedPersona?: string;
  selectedObjective?: number;
}

export default function SamaNaffa() {
  const router = useRouter();
  const { setSelectionData } = useSelection();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormSubmissionData | null>(null);
  
  // Refs for scrolling
  const summaryRef = useRef<HTMLDivElement>(null);
  const plannerRef = useRef<HTMLDivElement>(null);

  const scrollToElement = (elementRef: React.RefObject<HTMLDivElement | null>, offset = -100) => {
    if (elementRef.current) {
      const elementTop = elementRef.current.offsetTop + offset;
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    }
  };

  const handleShowForm = (data: FormSubmissionData) => {
    setFormData(data);
    setShowForm(true);
  };

  const handleModifyPlan = () => {
    setShowForm(false);
    // Scroll back to the planner after a short delay to ensure state has updated
    setTimeout(() => {
      scrollToElement(plannerRef, -50);
    }, 100);
  };

  // Auto-scroll to summary when form is shown
  useEffect(() => {
    if (showForm) {
      // Small delay to ensure the DOM has updated
      setTimeout(() => {
        scrollToElement(summaryRef, -50);
      }, 100);
    }
  }, [showForm]);

  const handleStartNow = () => {
    if (!formData) return;

    // Store selection data in context and localStorage
    setSelectionData({
      type: 'sama-naffa',
      objective: formData.objective,
      monthlyAmount: formData.monthlyAmount,
      duration: formData.duration,
      projectedAmount: formData.projectedAmount,
      simulationMode: formData.simulationMode,
      selectedPersona: formData.selectedPersona,
      selectedObjective: formData.selectedObjective,
    });

    // Navigate to registration
    router.push('/register');
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
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <main id="main">
        <section className="relative pt-32 pb-20 overflow-hidden max-h-[50vh] flex items-center" aria-label="Sama Naffa Hero">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/sama-naffa_bg.jpg"
              alt="Sama Naffa - Épargne Intelligente pour l'Afrique de l'Ouest"
              fill
              className="object-cover object-center"
              priority
              quality={90}
            />
          </div>

          {/* Enhanced gradient overlay with brand colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-sama-accent-gold/20 to-sama-primary-green/20"></div>
          
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
        <section className="py-20 bg-gradient-to-b from-white to-[#F2F8F4]" aria-label="Fonctionnalités principales">
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
          <SavingsPlanner onShowForm={handleShowForm} />
        </div>


        {/* Form Display Section */}
        {showForm && formData && (
          <div ref={summaryRef} className="py-20 bg-gradient-to-b from-[#F2F8F4] to-white">
            <div className="max-w-3xl mx-auto px-6">
              <div className="sama-card p-8 lg:p-12 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#435933]/5 to-[#C38D1C]/5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#C38D1C]/5 to-[#435933]/5 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#435933] to-[#30461f] rounded-2xl mb-4">
                      <CheckCircleIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="sama-heading-section mb-3">
                      Récapitulatif de votre plan d'épargne
                    </h3>
                    <p className="sama-body-regular text-[#4d525f]">
                      Votre plan personnalisé est prêt. Vous pouvez le modifier ou commencer immédiatement.
                    </p>
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="sama-card-feature p-6">
                      <div className="flex justify-between items-center">
                        <span className="sama-body-regular font-semibold">Objectif:</span>
                        <span className="sama-body-regular text-[#435933] font-medium">{formData.objective}</span>
                      </div>
                    </div>
                    <div className="sama-card-feature p-6">
                      <div className="flex justify-between items-center">
                        <span className="sama-body-regular font-semibold">Montant mensuel:</span>
                        <span className="sama-body-regular text-[#435933] font-medium">{formData.monthlyAmount.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                    <div className="sama-card-feature p-6">
                      <div className="flex justify-between items-center">
                        <span className="sama-body-regular font-semibold">Durée:</span>
                        <span className="sama-body-regular text-[#435933] font-medium">{formData.duration} ans</span>
                      </div>
                    </div>
                    <div className="sama-card-feature p-6 border-2 border-[#435933]/20 bg-gradient-to-r from-[#435933]/5 to-[#C38D1C]/5">
                      <div className="flex justify-between items-center">
                        <span className="sama-body-large font-bold">Capital final estimé:</span>
                        <span className="sama-body-large font-bold text-[#435933]">{formData.projectedAmount.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button
                      onClick={handleModifyPlan}
                      className="group relative px-8 py-4 bg-transparent text-[#435933] font-semibold text-lg rounded-2xl border-2 border-[#435933] overflow-hidden transition-all duration-300 hover:bg-[#435933] hover:text-white hover:shadow-xl hover:-translate-y-1"
                    >
                      <span className="relative">Modifier le plan</span>
                    </button>
                    <button 
                      onClick={handleStartNow}
                      className="group relative px-12 py-5 sama-gradient-primary text-white font-semibold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-sama-primary-green/40 hover:-translate-y-2 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <span className="relative flex items-center gap-2">
                        Commencer maintenant
                        <ArrowRightIcon className="w-5 h-5" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
