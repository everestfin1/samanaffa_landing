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
    <div className="min-h-screen bg-white">
      {/* Skip to content */}
      <a href="#main" className="skip-link">Aller au contenu principal</a>
      
      {/* Hero Section */}
      <main id="main">
        <section className="relative overflow-hidden bg-white h-[60vh] -mt-20" aria-label="APE Hero">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/momar_bg.jpg"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-night/60 via-night/90 to-night/70"></div>
          
          {/* Subtle metallic accent overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold-metallic/5 via-transparent to-gold-metallic/10"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center pt-20">
            <div className="text-center w-full">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gold-metallic/10 backdrop-blur-sm border border-gold-metallic/20 rounded-full text-sm font-medium mb-8">
                <ShieldCheckIcon className="w-5 h-5 text-gold-metallic" />
                <span className="bg-gradient-to-r from-gold-dark to-gold-metallic bg-clip-text text-transparent font-semibold">
                  Garantie État du Sénégal
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl text-white font-light tracking-tight mb-6 drop-shadow-2xl">
                APE Sénégal
                <span className="block text-2xl lg:text-3xl text-white/95 font-light mt-2">
                  Appel Public à l'Épargne
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-white/95 font-light max-w-3xl mx-auto drop-shadow-lg">
                Investissement sécurisé dans les obligations d'État avec rendements fixes garantis.
                <br className="hidden lg:block" />
                Participez au financement des projets stratégiques du Sénégal.
              </p>
            </div>
          </div>
        </section>

        {/* Key Stats Section - Moved down from hero */}
        <section className="py-16 bg-gradient-to-br from-white via-gold-light/30 to-gold-metallic/10" aria-label="Statistiques clés">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-center items-center gap-8 lg:gap-12 text-center">
              <div className="group">
                <div className="text-3xl lg:text-4xl font-light text-gold-metallic mb-2">300 Milliards FCFA</div>
                <div className="text-sm text-gray-medium uppercase tracking-wider font-medium">Programme</div>
              </div>
              <div className="w-px h-16 bg-gold-metallic/20"></div>
              <div className="group">
                <div className="text-3xl lg:text-4xl font-light text-gold-metallic mb-2">7.07%</div>
                <div className="text-sm text-gray-medium uppercase tracking-wider font-medium">Rendement Max</div>
              </div>
              <div className="w-px h-16 bg-gold-metallic/20"></div>
              <div className="group">
                <div className="text-3xl lg:text-4xl font-light text-gold-metallic mb-2">10,000 FCFA</div>
                <div className="text-sm text-gray-medium uppercase tracking-wider font-medium">Minimum</div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Tranches - Main Content */}
        <section className="py-20 bg-white" aria-label="Tranches d'investissement APE">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl text-night font-light mb-4 tracking-tight">
                Choisissez Votre Tranche d'Investissement
              </h2>
              <p className="text-lg text-gray-medium font-light max-w-2xl mx-auto">
                4 options d'investissement adaptées à vos objectifs financiers
              </p>
            </div>

            {/* Tranches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {investmentTranches.map((tranche, index) => (
                <div
                  key={tranche.id}
                  className="group relative bg-white rounded-3xl p-8 border border-gold-metallic/10 hover:border-gold-metallic/30 transition-all duration-500 hover:shadow-2xl hover:shadow-gold-metallic/10 hover:-translate-y-2"
                >
                  {/* Card Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-metallic/10 to-gold-metallic/5 rounded-2xl mb-6 group-hover:from-gold-metallic/20 group-hover:to-gold-metallic/10 transition-all duration-300">
                      <span className="text-2xl font-bold text-gold-metallic">
                        {tranche.id}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-night mb-2">
                      Tranche {tranche.id}
                    </h3>
                    
                    <div className="text-6xl font-bold text-gold-metallic mb-2 leading-none">
                      {tranche.rate.toFixed(2)}%
                    </div>

                    <div className="text-lg text-gray-medium font-light">
                      {tranche.duration} • {tranche.nominalValue}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-3 px-4 bg-gold-metallic/5 rounded-xl">
                      <span className="text-gray-600 font-medium">Montant du programme</span>
                      <span className="font-bold text-night text-lg">{tranche.amount}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-gold-metallic/5 rounded-xl">
                      <span className="text-gray-600 font-medium">Valeur nominale</span>
                      <span className="font-bold text-night text-lg">{tranche.nominalValue}</span>
                    </div>
                  </div>
                  
                  <hr className="my-6 border-gold-metallic/20" />

                  {/* Additional Info */}
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Coupon:</span>
                      <span className="font-bold text-gold-metallic text-lg">{tranche.coupon}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Maturité:</span>
                      <span className="font-medium text-gray-700">{tranche.additionalInfo.maturite}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Différé:</span>
                      <span className="font-medium text-gray-700">{tranche.additionalInfo.differe}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Remboursement:</span>
                      <span className="font-medium text-gray-700">{tranche.additionalInfo.remboursement}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleTrancheSelection(tranche.id)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-gold-dark to-gold-metallic text-night font-bold text-lg rounded-2xl hover:shadow-xl hover:shadow-gold-metallic/30 transition-all duration-300 hover:-translate-y-1 group/btn"
                  >
                    <span className="flex items-center justify-center">
                      Je souscris
                      <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              ))}
            </div>
            
            {/* Key Benefits - Replaced with enhanced stats */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-gradient-to-br from-gold-metallic/5 to-gold-light/10 rounded-3xl border border-gold-metallic/10 hover:border-gold-metallic/20 transition-all duration-300">
                <ShieldCheckIcon className="w-16 h-16 text-gold-metallic mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-night mb-4">Garantie d'État</h3>
                <p className="text-gray-medium font-light text-lg leading-relaxed">
                  Investissement 100% sécurisé par l'État du Sénégal
                </p>
              </div>
              
              <div className="text-center p-8 bg-gradient-to-br from-gold-metallic/5 to-gold-light/10 rounded-3xl border border-gold-metallic/10 hover:border-gold-metallic/20 transition-all duration-300">
                <ArrowTrendingUpIcon className="w-16 h-16 text-gold-metallic mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-night mb-4">Rendements Fixes</h3>
                <p className="text-gray-medium font-light text-lg leading-relaxed">
                  Taux garantis de 6.40% à 7.07% selon la durée
                </p>
              </div>
              
              <div className="text-center p-8 bg-gradient-to-br from-gold-metallic/5 to-gold-light/10 rounded-3xl border border-gold-metallic/10 hover:border-gold-metallic/20 transition-all duration-300">
                <CalendarDaysIcon className="w-16 h-16 text-gold-metallic mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-night mb-4">Paiements Réguliers</h3>
                <p className="text-gray-medium font-light text-lg leading-relaxed">
                  Intérêts versés tous les 6 mois
                </p>
              </div>
            </div>
          </div>
        </section>



      </main>
    </div>
  );
}
