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

export default function APE() {
  const investmentTranches = [
    {
      id: "A",
      duration: "3 ans",
      coupon: 6.40,
      rate: 6.50,
      amount: "60 milliards FCFA",
      nominalValue: "10,000 FCFA",
      additionalInfo: {
        maturite: "Septembre 2028",
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
        maturite: "Septembre 2030",
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
        maturite: "Septembre 2032",
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
        maturite: "Septembre 2035",
        differe: "2 ans",
        duration: "10 ans",
        remboursement: "Différé 2 ans"
      }
    }
  ];

  const scrollToFormWithTranche = (trancheId: string) => {
    // This would scroll to a subscription form with the selected tranche
    console.log(`Scrolling to form with tranche ${trancheId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Skip to content */}
      <a href="#main" className="skip-link">Aller au contenu principal</a>
      
      {/* Header Section - Compact */}
      <main id="main">
        <section className="pt-32 pb-16 bg-gradient-to-br from-white via-gold-light/50 via-timberwolf/60 to-gold-metallic/30" aria-label="APE Header">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gold-metallic/10 backdrop-blur-sm border border-gold-metallic/20 rounded-full text-sm font-medium mb-8">
              <ShieldCheckIcon className="w-5 h-5 text-gold-metallic" />
              <span className="bg-gradient-to-r from-gold-dark to-gold-metallic bg-clip-text text-transparent font-semibold">
                Garantie État du Sénégal
                  </span>
              </div>

            <h1 className="text-4xl lg:text-6xl text-night font-light tracking-tight mb-6">
                  APE Sénégal
              <span className="block text-3xl lg:text-4xl bg-gradient-to-r from-gold-dark to-gold-metallic bg-clip-text text-transparent font-light mt-2">
                    Appel Public à l'Épargne
                  </span>
                </h1>
            
            <p className="text-lg lg:text-xl text-gray-medium font-light max-w-3xl mx-auto mb-8">
              Investissement sécurisé dans les obligations d'État avec rendements fixes garantis.
              Participez au financement des projets stratégiques du Sénégal.
            </p>

            {/* Key Stats - Horizontal Layout */}
            <div className="flex justify-center items-center gap-8 lg:gap-12 text-center">
              <div className="group">
                <div className="text-2xl lg:text-3xl font-light text-gold-metallic mb-1">150B FCFA</div>
                <div className="text-xs text-gray-medium uppercase tracking-wider">Programme</div>
              </div>
              <div className="w-px h-12 bg-gold-metallic/20"></div>
              <div className="group">
                <div className="text-2xl lg:text-3xl font-light text-gold-metallic mb-1">7.07%</div>
                <div className="text-xs text-gray-medium uppercase tracking-wider">Rendement Max</div>
              </div>
              <div className="w-px h-12 bg-gold-metallic/20"></div>
              <div className="group">
                <div className="text-2xl lg:text-3xl font-light text-gold-metallic mb-1">10,000 FCFA</div>
                <div className="text-xs text-gray-medium uppercase tracking-wider">Minimum</div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {investmentTranches.map((tranche, index) => (
                <div
                  key={tranche.id}
                  className="group relative bg-white border-2 border-gold-metallic/10 rounded-2xl p-6 hover:border-gold-metallic/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gold-metallic/10 rounded-xl mb-4">
                      <span className="text-xl font-semibold text-gold-metallic">
                        {tranche.id}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-medium text-night mb-2">
                      Tranche {tranche.id}
                    </h3>
                    
                    <div className="text-3xl font-light text-gold-metallic mb-1">
                      {tranche.rate.toFixed(2)}%
                  </div>

                    <div className="text-sm text-gray-medium mb-4">
                      {tranche.duration} • {tranche.nominalValue}
                  </div>

                    <div className="space-y-2 text-sm text-gray-dark mb-6">
                      <div className="flex justify-between">
                        <span>Coupon:</span>
                        <span className="font-medium">{tranche.coupon}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maturité:</span>
                        <span className="font-medium">{tranche.additionalInfo.maturite}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Différé:</span>
                        <span className="font-medium">{tranche.additionalInfo.differe}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => scrollToFormWithTranche(tranche.id)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-gold-dark to-gold-metallic text-night font-medium rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Investir
                  </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gold-metallic/5 rounded-2xl">
                <ShieldCheckIcon className="w-12 h-12 text-gold-metallic mx-auto mb-4" />
                <h3 className="text-lg font-medium text-night mb-2">Garantie d'État</h3>
                <p className="text-gray-medium font-light">
                  Investissement 100% sécurisé par l'État du Sénégal
                </p>
              </div>
              
              <div className="text-center p-6 bg-gold-metallic/5 rounded-2xl">
                <ArrowTrendingUpIcon className="w-12 h-12 text-gold-metallic mx-auto mb-4" />
                <h3 className="text-lg font-medium text-night mb-2">Rendements Fixes</h3>
                <p className="text-gray-medium font-light">
                  Taux garantis de 6.40% à 7.07% selon la durée
                </p>
              </div>
              
              <div className="text-center p-6 bg-gold-metallic/5 rounded-2xl">
                <CalendarDaysIcon className="w-12 h-12 text-gold-metallic mx-auto mb-4" />
                <h3 className="text-lg font-medium text-night mb-2">Paiements Réguliers</h3>
                <p className="text-gray-medium font-light">
                  Intérêts versés tous les 6 mois
                </p>
            </div>
          </div>
        </div>
      </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-tr from-gold-metallic/15 via-white/80 via-gold-light/40 to-timberwolf/50" aria-label="Call to Action">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-gold-metallic/10 to-gold-light/20 backdrop-blur-sm rounded-3xl p-12 border border-gold-metallic/20">
              <h2 className="text-3xl lg:text-4xl text-night font-light mb-4 tracking-tight">
                Prêt à Investir dans l'APE ?
                </h2>
              <p className="text-lg text-gray-medium font-light mb-8 max-w-2xl mx-auto leading-relaxed">
                Participez au développement du Sénégal avec un investissement sécurisé 
                et des rendements attractifs garantis par l'État.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-gold-dark to-gold-metallic text-night font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-r from-gold-metallic to-gold-light opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center">
                      Commencer mon investissement
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                <button className="px-8 py-4 bg-white/50 backdrop-blur-md border border-gold-metallic/30 text-night font-medium rounded-xl hover:bg-white/70 transition-all duration-300">
                  Calculer mes rendements
                  </button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
