'use client';

import {
  BuildingLibraryIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useSelection } from '../../lib/selection-context';
import Image from 'next/image';

export default function APE() {
  const router = useRouter();
  const { setSelectionData } = useSelection();
  
  const investmentTranches = [
    {
      id: "A",
      duration: "3 ans",
      coupon: 6.40,
      rate: 6.50,
      amount: "60 milliards FCFA",
      nominalValue: "10,000 FCFA",
      additionalInfo: {
        maturite: "2028",
        differe: "Aucun",
        duration: "3 ans",
        remboursement: "In fine"
      }
    },
    {
      id: "B", 
      duration: "5 ans",
      coupon: 6.60,
      rate: 6.71,
      amount: "100 milliards FCFA",
      nominalValue: "10,000 FCFA",
      additionalInfo: {
        maturite: "2030",
        differe: "1 an",
        duration: "5 ans",
        remboursement: "Différé 1 an"
      }
    },
    {
      id: "C",
      duration: "7 ans", 
      coupon: 6.75,
      rate: 6.86,
      amount: "80 milliards FCFA",
      nominalValue: "10,000 FCFA",
      additionalInfo: {
        maturite: "2032",
        differe: "2 ans",
        duration: "7 ans",
        remboursement: "Différé 2 ans"
      }
    },
    {
      id: "D",
      duration: "10 ans",
      coupon: 6.95,
      rate: 7.07,
      amount: "60 milliards FCFA", 
      nominalValue: "10,000 FCFA",
      additionalInfo: {
        maturite: "2035",
        differe: "2 ans",
        duration: "10 ans",
        remboursement: "Différé 2 ans"
      }
    }
  ];

  const handleTrancheSelection = (trancheId: string) => {
    // Find the selected tranche
    const selectedTranche = investmentTranches.find(t => t.id === trancheId);
    
    if (!selectedTranche) return;

    // Store selection data in context and localStorage
    setSelectionData({
      type: 'ape',
      trancheId: selectedTranche.id,
      duration: selectedTranche.duration,
      rate: selectedTranche.rate,
      coupon: selectedTranche.coupon,
      amount: selectedTranche.amount,
      nominalValue: selectedTranche.nominalValue,
      additionalInfo: selectedTranche.additionalInfo
    });

    // Navigate to registration
    router.push('/register');
  };

  return (
    <div className="min-h-screen">    
      {/* Hero Section */}
      <main id="main">
        <section className="relative pt-32 pb-20 overflow-hidden max-h-[50vh] flex items-center" aria-label="APE Hero">
          {/* Background Image */}
          {/* <div className="absolute inset-0">
            <Image
              src="/momar_bg.jpg"
              alt="APE - Emprunt Obligataire État du Sénégal"
              fill
              className="object-cover object-center"
              priority
              quality={90}
            />
          </div> */}
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-sama-accent-gold/50 to-sama-primary-green/50"></div>
          
          {/* Subtle metallic accent overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-sama-accent-gold/40 via-transparent to-sama-primary-green/40"></div> */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-sama-accent-gold/20 to-sama-primary-green/20"></div> */}

          
          <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
            <div className="text-center w-full max-w-5xl mx-auto">
              {/* <div className="inline-flex items-center gap-3 px-6 py-3 bg-sama-accent-gold/10 backdrop-blur-sm border border-sama-accent-gold/30 rounded-full text-sm font-medium mb-4">
                <ShieldCheckIcon className="w-5 h-5" />
                <span className="text-white font-semibold">
                  Garantie État du Sénégal
                </span>
              </div> */}

              <h1 className="sama-heading-hero sama-text-primary mb-6 tracking-tight">
                Emprunt Obligataire
                <span className="block text-2xl lg:text-4xl sama-text-gold font-medium mt-3">
                  Appel Public à l'Épargne
                </span>
              </h1>

              {/* <p className="sama-body-large text-white/95 max-w-4xl mx-auto mb-8 leading-relaxed">
                Investissement sécurisé dans les obligations d'État avec rendements fixes garantis.
                Participez au financement des projets stratégiques du Sénégal.
              </p> */}
            </div>
          </div>
        </section>

        {/* Key Stats Section - Enhanced */}
        <section className="py-20 bg-gradient-to-b from-white to-[#F2F8F4]" aria-label="Statistiques clés">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="sama-heading-section mb-4">
                Programme d'Émission
              </h2>
              <p className="sama-body-large max-w-2xl mx-auto">
                Un investissement d'État sécurisé avec des rendements attractifs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="sama-card-feature text-center p-8 group">
                <div className="w-16 h-16 bg-sama-accent-gold rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BanknotesIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-sama-accent-gold mb-2">300 Milliards</div>
                <div className="sama-body-small uppercase tracking-wider font-medium">Programme Total FCFA</div>
              </div>
              
              <div className="sama-card-feature text-center p-8 group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#435933] to-[#30461f] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ArrowTrendingUpIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-[#435933] mb-2">7.07%</div>
                <div className="sama-body-small uppercase tracking-wider font-medium">Rendement Maximum</div>
              </div>
              
              <div className="sama-card-feature text-center p-8 group">
                <div className="w-16 h-16 bg-sama-accent-gold rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircleIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-sama-accent-gold mb-2">10,000</div>
                <div className="sama-body-small uppercase tracking-wider font-medium">Minimum FCFA</div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Tranches - Main Content */}
        <section className="py-20 bg-gradient-to-b from-[#F2F8F4] to-white" aria-label="Tranches d'investissement APE">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="sama-heading-section mb-6">
                Choisissez Votre Tranche d'Investissement
              </h2>
              <p className="sama-body-large max-w-3xl mx-auto">
                4 options d'investissement adaptées à vos objectifs financiers avec des rendements garantis par l'État
              </p>
            </div>

            {/* Tranches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
              {investmentTranches.map((tranche, index) => (
                <div
                  key={tranche.id}
                  className="sama-card group relative p-8 lg:p-10 bg-white rounded-2xl border-2 border-[#435933]/10 hover:border-[#C38D1C]/30 shadow-xl hover:shadow-2xl hover:shadow-[#C38D1C]/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Accent border */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C38D1C] to-[#435933] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Card Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#C38D1C] to-[#b3830f] rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <span className="text-3xl font-bold text-white">
                        {tranche.id}
                      </span>
                    </div>
                    
                    <h3 className="sama-heading-card mb-4">
                      Tranche {tranche.id}
                    </h3>
                    
                    <div className="text-5xl lg:text-6xl font-bold text-[#C38D1C] mb-3 leading-none">
                      {tranche.rate.toFixed(2)}%
                    </div>

                    <div className="sama-body-regular text-[#4d525f]">
                      {tranche.duration} • {tranche.nominalValue}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-4 mb-8">
                    <div className="sama-card-feature p-4">
                      <div className="flex justify-between items-center">
                        <span className="sama-body-regular font-medium">Montant du programme</span>
                        <span className="sama-body-regular font-bold text-[#435933]">{tranche.amount}</span>
                      </div>
                    </div>
                    <div className="sama-card-feature p-4">
                      <div className="flex justify-between items-center">
                        <span className="sama-body-regular font-medium">Valeur nominale</span>
                        <span className="sama-body-regular font-bold text-[#435933]">{tranche.nominalValue}</span>
                      </div>
                    </div>
                  </div>
                  
                  <hr className="my-6 border-[#435933]/20" />

                  {/* Additional Info */}
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="sama-body-regular font-semibold">Coupon:</span>
                      <span className="sama-body-regular font-bold text-[#C38D1C]">{tranche.coupon}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="sama-body-regular font-semibold">Maturité:</span>
                      <span className="sama-body-regular text-[#4d525f]">{tranche.additionalInfo.maturite}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="sama-body-regular font-semibold">Différé:</span>
                      <span className="sama-body-regular text-[#4d525f]">{tranche.additionalInfo.differe}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="sama-body-regular font-semibold">Remboursement:</span>
                      <span className="sama-body-regular text-[#4d525f]">{tranche.additionalInfo.remboursement}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleTrancheSelection(tranche.id)}
                    className="group/btn relative w-full px-8 py-5 bg-gradient-to-r from-[#C38D1C] to-[#b3830f] text-white font-semibold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#C38D1C]/40 hover:-translate-y-2 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      Je souscris
                      <ArrowRightIcon className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              ))}
            </div>
            
            {/* Key Benefits - Enhanced */}
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mt-8">
              <div className="sama-card-feature text-center p-8 group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#435933] to-[#30461f] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="sama-heading-card mb-4">Garantie d'État</h3>
                <p className="sama-body-regular leading-relaxed">
                  Investissement 100% sécurisé par l'État du Sénégal avec protection totale du capital
                </p>
              </div>
              
              <div className="sama-card-feature text-center p-8 group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#C38D1C] to-[#b3830f] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <ArrowTrendingUpIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="sama-heading-card mb-4">Rendements Fixes</h3>
                <p className="sama-body-regular leading-relaxed">
                  Taux garantis de 6.40% à 7.07% selon la durée d'investissement choisie
                </p>
              </div>
              
              <div className="sama-card-feature text-center p-8 group">
                <div className="w-16 h-16 bg-sama-primary-green rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <CalendarDaysIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="sama-heading-card mb-4">Paiements Réguliers</h3>
                <p className="sama-body-regular leading-relaxed">
                  Intérêts versés tous les 6 mois directement sur votre compte
                </p>
              </div>
            </div>
            
            {/* Additional Trust Indicators */}
            <div className="mt-16 text-center">
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-[#435933]" />
                  <span className="sama-body-small">Régulé par l'État</span>
                </div>
                <div className="flex items-center gap-2">
                  <BuildingLibraryIcon className="w-5 h-5 text-[#C38D1C]" />
                  <span className="sama-body-small">Obligations Souveraines</span>
                </div>
                <div className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5 text-[#C38D1C]" />
                  <span className="sama-body-small">Rendements Garantis</span>
                </div>
              </div>
            </div>
          </div>
        </section>



      </main>
    </div>
  );
}
