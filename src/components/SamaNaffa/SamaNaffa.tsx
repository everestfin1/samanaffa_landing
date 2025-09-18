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
      {/* Skip to content */}
      <a href="#main" className="skip-link">Aller au contenu principal</a>
      
      {/* Hero Section */}
      <main id="main">
        <section className="relative pt-32 pb-16 overflow-hidden h-[60vh]" aria-label="Sama Naffa Hero">
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

          {/* Enhanced dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/80 to-white/30 "></div>
          
          <div className="relative max-w-6xl mx-auto px-6 h-full flex items-center">
            <div className="text-center w-full">
              <h1 className="text-4xl lg:text-6xl text-white font-bold tracking-tight mb-6 ">
                Sama Naffa
                <span className="block text-2xl lg:text-3xl text-white/95 font-medium mt-2">
                  Épargne Intelligente pour l'Afrique de l'Ouest
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-white/95 font-light max-w-3xl mx-auto ">
                Révolutionnez vos habitudes d'épargne avec des outils modernes
                adaptés à la culture financière sénégalaise.
              </p>
            </div>
          </div>
        </section>
        {/* Features Grid - Horizontal Layout */}
        <section className="py-16" aria-label="Fonctionnalités principales">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl text-[#01081b] font-bold mb-4 tracking-tight">
                Fonctionnalités Principales
              </h2>
              <p className="text-lg text-gray-600 font-normal max-w-2xl mx-auto">
                Des outils modernes pour une épargne intelligente et culturellement adaptée
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 border border-[#435933]/20 hover:border-[#435933]/40 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-[#435933]/10 rounded-xl flex items-center justify-center">
                        <feature.icon className="w-7 h-7 text-[#435933]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#01081b] mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed font-normal">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Savings Planner Section - Moved under hero */}
        <div ref={plannerRef}>
          <SavingsPlanner onShowForm={handleShowForm} />
        </div>


        {/* Form Display Section */}
        {showForm && formData && (
          <div ref={summaryRef} className="py-16 bg-white">
            <div className="max-w-2xl mx-auto px-6">
              <div className="bg-white rounded-2xl lg:rounded-[35px] p-8 border border-[#435933]/20 shadow-xl">
                <h3 className="text-2xl font-bold text-[#01081b] mb-6 text-center">
                  Récapitulatif de votre plan d'épargne
                </h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#435933]/10 to-[#C38D1C]/10 rounded-xl border border-[#435933]/20">
                    <span className="font-semibold text-[#01081b]">Objectif:</span>
                    <span className="text-gray-600">{formData.objective}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#435933]/10 to-[#C38D1C]/10 rounded-xl border border-[#435933]/20">
                    <span className="font-semibold text-[#01081b]">Montant mensuel:</span>
                    <span className="text-gray-600">{formData.monthlyAmount.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#435933]/10 to-[#C38D1C]/10 rounded-xl border border-[#435933]/20">
                    <span className="font-semibold text-[#01081b]">Durée:</span>
                    <span className="text-gray-600">{formData.duration} ans</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#435933]/10 to-[#C38D1C]/10 rounded-xl border border-[#435933]/20">
                    <span className="font-bold text-[#01081b]">Capital final estimé:</span>
                    <span className="font-bold text-[#435933] text-lg">{formData.projectedAmount.toLocaleString()} FCFA</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleModifyPlan}
                    className="px-6 py-3 bg-gray-100 text-[#01081b] font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Modifier le plan
                  </button>
                  <button 
                    onClick={handleStartNow}
                    className="px-8 py-3 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300"
                  >
                    Commencer maintenant
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
