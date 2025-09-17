'use client';

import {
  BuildingLibraryIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  UserGroupIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function APE() {
  const bondFeatures = [
    {
      icon: ShieldCheckIcon,
      title: "Garantie Gouvernementale",
      description: "Investissement sécurisé avec la garantie complète de l'État du Sénégal"
    },
    {
      icon: ArrowTrendingUpIcon,
      title: "Rendements Attractifs",
      description: "Taux d'intérêt compétitifs de 6.40% à 6.95% selon la durée d'investissement"
    },
    {
      icon: CalendarDaysIcon,
      title: "Flexibilité des Durées",
      description: "Choisissez parmi 3, 5, 7 ou 10 ans selon vos objectifs financiers"
    },
    {
      icon: BanknotesIcon,
      title: "Accessible à Tous",
      description: "Investissement minimum de seulement 10,000 FCFA par obligation"
    }
  ];

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

  const eligibleInvestors = [
    {
      category: "Citoyens Sénégalais",
      description: "Résidents et membres de la diaspora",
      icon: UserGroupIcon
    },
    {
      category: "Investisseurs Institutionnels",
      description: "Banques, compagnies d'assurance, fonds de pension",
      icon: BuildingLibraryIcon
    },
    {
      category: "Entreprises Privées",
      description: "Sociétés de toutes tailles cherchant des opportunités d'investissement",
      icon: CurrencyDollarIcon
    },
    {
      category: "Zone UEMOA",
      description: "Personnes physiques de l'Union Économique et Monétaire Ouest Africaine",
      icon: GlobeAltIcon
    }
  ];

  const investmentProcess = [
    {
      step: 1,
      title: "Préparation des Documents",
      description: "Rassemblez votre carte d'identité, justificatifs de revenus et coordonnées bancaires"
    },
    {
      step: 2,
      title: "Ouverture de Compte-Titres",
      description: "Ouvrez un compte chez un intermédiaire agréé (SGI ou banque partenaire)"
    },
    {
      step: 3,
      title: "Souscription",
      description: "Passez votre ordre d'achat d'obligations APE selon votre capacité d'investissement"
    },
    {
      step: 4,
      title: "Suivi et Gestion",
      description: "Recevez vos intérêts semestriels et suivez l'évolution de votre portefeuille"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="heading-1 text-4xl md:text-5xl text-night mb-6">
          APE Sénégal
          <span className="text-gold-metallic block mt-2">Appel Public à l'Épargne</span>
        </h1>
        <p className="body-copy text-xl text-night/70 max-w-4xl mx-auto mb-8">
          Participez au développement du Sénégal avec l'Appel Public à l'Épargne de 150 milliards FCFA. 
          Un investissement sécurisé, garanti par l'État, pour financer les projets stratégiques 
          de la Vision Sénégal 2050.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gold-metallic text-night px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-metallic/90 transition-colors">
            Commencer mon investissement
          </button>
          <button className="border-2 border-night text-night px-8 py-4 rounded-lg font-semibold text-lg hover:bg-night hover:text-white transition-colors">
            Télécharger la brochure
          </button>
        </div>
      </div>

      {/* Key Statistics */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-gold-metallic to-gold-metallic/80 text-night rounded-xl p-6 text-center">
            <ArrowTrendingUpIcon className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">6.95%</h3>
            <p className="text-sm opacity-90">Taux maximum (10 ans)</p>
          </div>

          <div className="bg-white border border-timberwolf/20 rounded-xl p-6 text-center">
            <BanknotesIcon className="w-12 h-12 text-gold-metallic mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-night mb-2">10,000</h3>
            <p className="text-sm text-night/70">FCFA minimum par obligation</p>
          </div>

          <div className="bg-white border border-timberwolf/20 rounded-xl p-6 text-center">
            <BuildingLibraryIcon className="w-12 h-12 text-gold-metallic mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-night mb-2">150B</h3>
            <p className="text-sm text-night/70">FCFA programme total</p>
          </div>

          <div className="bg-white border border-timberwolf/20 rounded-xl p-6 text-center">
            <ClockIcon className="w-12 h-12 text-gold-metallic mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-night mb-2">6 mois</h3>
            <p className="text-sm text-night/70">Paiement des intérêts</p>
          </div>
        </div>
      </section>

      {/* EVEREST Finance Role */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-night to-night/90 text-white rounded-2xl p-12">
          <div className="text-center mb-8">
            <h2 className="heading-2 text-3xl mb-4">Le Rôle d'EVEREST Finance</h2>
            <p className="text-white/80 text-lg max-w-3xl mx-auto">
              EVEREST Finance SGI est votre partenaire de confiance pour l'investissement dans l'APE Sénégal, 
              offrant une plateforme digitale complète et des services d'accompagnement personnalisés.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-metallic/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="w-8 h-8 text-gold-metallic" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Plateforme Digitale</h3>
              <p className="text-white/70 text-sm">
                Interface moderne pour la planification et la pré-souscription APE
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-metallic/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-8 h-8 text-gold-metallic" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Éducation Financière</h3>
              <p className="text-white/70 text-sm">
                Calculateurs avancés, guides d'investissement et formations
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-metallic/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-gold-metallic" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Conformité & KYC</h3>
              <p className="text-white/70 text-sm">
                Processus sécurisé et conforme aux réglementations financières
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="mb-16">
        <h2 className="heading-2 text-3xl text-night text-center mb-12">
          Pourquoi Investir dans l'APE ?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bondFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-timberwolf/20 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gold-metallic/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-gold-metallic" />
              </div>
              <h3 className="text-lg font-semibold text-night mb-3">{feature.title}</h3>
              <p className="text-night/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Investment Options */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="heading-2 text-3xl text-night mb-6">
            Options d'Investissement APE
          </h2>
          <p className="text-night/70 text-lg max-w-3xl mx-auto">
            Choisissez la tranche qui correspond le mieux à vos objectifs d'investissement. 
            Chaque option offre des conditions attractives avec la garantie de l'État du Sénégal.
          </p>
        </div>

        {/* Investment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {investmentTranches.map((tranche, index) => (
            <div 
              key={tranche.id} 
              className="bg-white rounded-2xl p-8 border border-timberwolf/20 hover:shadow-xl transition-all duration-300 hover:border-gold-metallic/30"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-night mb-2">
                  Tranche {tranche.id}
                </h3>
                <div className="text-lg text-night/70 mb-4">{tranche.duration}</div>
                <div className="text-5xl font-bold text-gold-metallic mb-2">
                  {tranche.rate.toFixed(2)}%
                </div>
                <div className="text-sm text-night/60 mb-2">Rendement annuel</div>
                <div className="text-lg text-night/80">
                  Coupon: {tranche.coupon.toFixed(2)}% semestriel
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-timberwolf/20">
                  <span className="text-night/70">Montant de la tranche</span>
                  <span className="font-semibold text-night">{tranche.amount}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-timberwolf/20">
                  <span className="text-night/70">Valeur nominale</span>
                  <span className="font-semibold text-night">{tranche.nominalValue}</span>
                </div>
              </div>

              <div className="bg-gold-metallic/5 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-night mb-3 text-sm">Détails de la Tranche</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-night/60">Maturité:</span>
                    <span className="font-medium text-night">{tranche.additionalInfo.maturite}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-night/60">Différé:</span>
                    <span className="font-medium text-night">{tranche.additionalInfo.differe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-night/60">Duration:</span>
                    <span className="font-medium text-night">{tranche.additionalInfo.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-night/60">Remboursement:</span>
                    <span className="font-medium text-night">{tranche.additionalInfo.remboursement}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => scrollToFormWithTranche(tranche.id)}
                className="w-full bg-gold-metallic text-night py-4 rounded-lg font-semibold text-lg hover:bg-gold-metallic/90 transition-colors flex items-center justify-center group"
              >
                Investir dans la Tranche {tranche.id}
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Payment Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
          <h4 className="font-semibold text-blue-900 mb-6 flex items-center text-lg">
            <InformationCircleIcon className="w-6 h-6 mr-3" />
            Modalités de Paiement et Conditions
          </h4>
          <div className="grid md:grid-cols-2 gap-8 text-sm text-blue-800">
            <div>
              <h5 className="font-semibold mb-3 text-blue-900">Paiement des Intérêts</h5>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Versements semestriels (tous les 6 mois)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Dates fixes établies à l'émission</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Revenus réguliers et prévisibles</span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3 text-blue-900">Remboursement du Capital</h5>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Structure "in fine" pour les courtes durées</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Amortissement progressif pour les longues durées</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Période de différé selon la tranche</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Eligible Investors */}
      <section className="mb-16">
        <h2 className="heading-2 text-3xl text-night text-center mb-12">
          Qui Peut Investir ?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {eligibleInvestors.map((investor, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-timberwolf/20 text-center">
              <div className="w-16 h-16 bg-gold-metallic/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <investor.icon className="w-8 h-8 text-gold-metallic" />
              </div>
              <h3 className="text-lg font-semibold text-night mb-3">{investor.category}</h3>
              <p className="text-night/70 text-sm">{investor.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="font-semibold text-green-900 mb-3">Approche Inclusive</h4>
          <p className="text-green-800 text-sm">
            L'APE Sénégal est ouvert à un large spectre d'investisseurs pour assurer une participation 
            maximale et un soutien élargi aux initiatives de développement national. Cette approche 
            inclusive garantit que tous les citoyens et institutions peuvent contribuer à la croissance du pays.
          </p>
        </div>
      </section>

      {/* Investment Process */}
      <section className="mb-16">
        <h2 className="heading-2 text-3xl text-night text-center mb-12">
          Processus d'Investissement
        </h2>
        <div className="bg-white rounded-2xl p-8 border border-timberwolf/20">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {investmentProcess.map((process, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gold-metallic text-night rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {process.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-night mb-2">{process.title}</h4>
                    <p className="text-night/70 text-sm">{process.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-6">
              <div className="bg-gold-metallic/10 rounded-lg p-6">
                <h4 className="font-semibold text-night mb-4">Documents Requis</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-night/70">Carte d'identité ou passeport</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-night/70">Justificatif de domicile récent</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-night/70">Justificatifs de revenus (3 derniers bulletins)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-night/70">Coordonnées bancaires (RIB)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <span className="text-night/70">NINEA (si applicable)</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Frais et Coûts</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Frais de souscription:</span>
                    <span className="font-semibold text-green-700">Gratuit</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de garde (SGI):</span>
                    <span>Variables selon l'institution</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais administratifs:</span>
                    <span>Minimaux</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fund Utilization */}
      <section className="mb-16">
        <h2 className="heading-2 text-3xl text-night text-center mb-12">
          Utilisation des Fonds
        </h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-8 border border-timberwolf/20">
            <h3 className="text-xl font-semibold text-night mb-6 flex items-center">
              <StarIcon className="w-6 h-6 text-gold-metallic mr-3" />
              Vision Sénégal 2050
            </h3>
            <div className="space-y-4 text-sm text-night/70">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gold-metallic rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-night">Développement des Infrastructures</h4>
                  <p>Transport, énergie, télécommunications et infrastructures digitales</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gold-metallic rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-night">Industrialisation</h4>
                  <p>Diversification économique et développement du secteur manufacturier</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gold-metallic rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-night">Éducation et Santé</h4>
                  <p>Infrastructures éducatives et sanitaires modernes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gold-metallic rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-night">Durabilité Environnementale</h4>
                  <p>Projets verts et initiatives de développement durable</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 border border-timberwolf/20">
            <h3 className="text-xl font-semibold text-night mb-6 flex items-center">
              <DocumentTextIcon className="w-6 h-6 text-gold-metallic mr-3" />
              Loi de Finances 2025
            </h3>
            <div className="space-y-4 text-sm text-night/70">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gold-metallic rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-night">Financement du Déficit Budgétaire</h4>
                  <p>Couverture des besoins de financement à court et moyen terme</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gold-metallic rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-night">Modernisation des Services Publics</h4>
                  <p>Amélioration de l'efficacité et de la qualité des services</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gold-metallic rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-night">Programmes Sociaux</h4>
                  <p>Financement des initiatives de protection sociale</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gold-metallic rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-night">Stimulation Économique</h4>
                  <p>Mesures de relance et de soutien à l'économie</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-16">
        <h2 className="heading-2 text-3xl text-night text-center mb-12">
          Avantages de l'Investissement APE
        </h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-8 border border-timberwolf/20">
            <h3 className="text-xl font-semibold text-night mb-6">Pour les Investisseurs</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-gold-metallic flex-shrink-0" />
                <span className="text-night/80">Garantie complète de l'État du Sénégal</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-gold-metallic flex-shrink-0" />
                <span className="text-night/80">Rendements fixes et attractifs</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-gold-metallic flex-shrink-0" />
                <span className="text-night/80">Options de liquidité via la BRVM</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-gold-metallic flex-shrink-0" />
                <span className="text-night/80">Impact social positif</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-gold-metallic flex-shrink-0" />
                <span className="text-night/80">Avantages fiscaux potentiels</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 border border-timberwolf/20">
            <h3 className="text-xl font-semibold text-night mb-6">Pour le Développement National</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-gold-metallic flex-shrink-0" />
                <span className="text-night/80">Mobilisation des ressources domestiques</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-gold-metallic flex-shrink-0" />
                <span className="text-night/80">Développement du marché financier local</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-gold-metallic flex-shrink-0" />
                <span className="text-night/80">Stabilité des taux d'intérêt</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-gold-metallic flex-shrink-0" />
                <span className="text-night/80">Participation citoyenne au développement</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-gold-metallic flex-shrink-0" />
                <span className="text-night/80">Réduction de la dépendance externe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <div className="bg-gold-metallic/10 rounded-2xl p-12">
          <h2 className="heading-2 text-3xl text-night mb-6">
            Investissez dans l'Avenir du Sénégal
          </h2>
          <p className="text-night/70 text-lg mb-8 max-w-2xl mx-auto">
            L'APE Sénégal représente une opportunité unique d'allier rendement attractif 
            et contribution au développement national. Rejoignez cette initiative historique 
            et participez à la construction du Sénégal de demain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gold-metallic text-night px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-metallic/90 transition-colors flex items-center justify-center">
              Commencer mon investissement
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
            <button className="border-2 border-night text-night px-8 py-4 rounded-lg font-semibold text-lg hover:bg-night hover:text-white transition-colors">
              Calculer mes rendements
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
