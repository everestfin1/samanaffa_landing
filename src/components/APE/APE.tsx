"use client";

import {
  BuildingLibraryIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useSelection } from "../../lib/selection-context";
import Image from "next/image";

export default function APE() {
  const router = useRouter();
  const { setSelectionData } = useSelection();

  const investmentTranches = [
    {
      id: "A",
      duration: "3 ans",
      coupon: 6.4,
      rate: 6.5,
      amount: "60 milliards FCFA",
      nominalValue: "10,000 FCFA",
      additionalInfo: {
        maturite: "2028",
        differe: "Aucun",
        duration: "3 ans",
        remboursement: "In fine",
      },
    },
    {
      id: "B",
      duration: "5 ans",
      coupon: 6.6,
      rate: 6.71,
      amount: "100 milliards FCFA",
      nominalValue: "10,000 FCFA",
      additionalInfo: {
        maturite: "2030",
        differe: "1 an",
        duration: "5 ans",
        remboursement: "Différé 1 an",
      },
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
        remboursement: "Différé 2 ans",
      },
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
        remboursement: "Différé 2 ans",
      },
    },
  ];

  const handleTrancheSelection = (trancheId: string) => {
    // Find the selected tranche
    const selectedTranche = investmentTranches.find((t) => t.id === trancheId);

    if (!selectedTranche) return;

    // Store selection data in context and localStorage
    setSelectionData({
      type: "ape",
      trancheId: selectedTranche.id,
      duration: selectedTranche.duration,
      rate: selectedTranche.rate,
      coupon: selectedTranche.coupon,
      amount: selectedTranche.amount,
      nominalValue: selectedTranche.nominalValue,
      additionalInfo: selectedTranche.additionalInfo,
    });

    // Navigate to APE subscription page instead of registration
    router.push("/souscrire-ape");
  };

  const trancheOptions = [
    {
      value: "A" as const,
      label: "Tranche A",
      term: 3,
      rate: 6.4,
      description: "Court terme - 3 ans",
    },
    {
      value: "B" as const,
      label: "Tranche B",
      term: 5,
      rate: 6.6,
      description: "Moyen terme - 5 ans",
    },
    {
      value: "C" as const,
      label: "Tranche C",
      term: 7,
      rate: 6.75,
      description: "Long terme - 7 ans",
    },
    {
      value: "D" as const,
      label: "Tranche D",
      term: 10,
      rate: 6.95,
      description: "Très long terme - 10 ans",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <main id="main">
        <section
          className="relative pt-32 pb-20 overflow-hidden max-h-[50vh] flex items-center"
          aria-label="APE Hero"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/momar_bg.jpg"
              alt="APE - Emprunt Obligataire État du Sénégal"
              fill
              className="object-cover object-center"
              priority
              quality={90}
            />
          </div>

          {/* Dark overlay for better text readability */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-sama-accent-gold/50 to-sama-primary-green/50"></div> */}
          {/* <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
            <div className="text-center w-full max-w-5xl mx-auto">
            <h1 className="sama-heading-hero sama-text-primary mb-6 tracking-tight">
                Emprunt Obligataire
                <span className="block text-2xl lg:text-4xl sama-text-gold font-medium mt-3">
                  Appel Public à l'Épargne
                </span>
              </h1>
            </div>
          </div> */}
          {/* <p className="sama-body-large text-white/95 max-w-4xl mx-auto mb-8 leading-relaxed">
                Investissement sécurisé dans les obligations d'État avec rendements fixes garantis.
                Participez au financement des projets stratégiques du Sénégal.
              </p>*/}
        </section>

        {/* Key Stats Section - Enhanced */}
        <section className="py-20" aria-label="Statistiques clés">
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
                <div className="text-3xl lg:text-4xl font-bold text-sama-accent-gold mb-2">
                  300 Milliards
                </div>
                <div className="sama-body-small uppercase tracking-wider font-medium">
                  Programme Total FCFA
                </div>
              </div>

              <div className="sama-card-feature text-center p-8 group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#435933] to-[#30461f] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ArrowTrendingUpIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-[#435933] mb-2">
                  6.95%
                </div>
                <div className="sama-body-small uppercase tracking-wider font-medium">
                  Rendement Maximum
                </div>
              </div>

              <div className="sama-card-feature text-center p-8 group">
                <div className="w-16 h-16 bg-sama-accent-gold rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircleIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-sama-accent-gold mb-2">
                  10,000
                </div>
                <div className="sama-body-small uppercase tracking-wider font-medium">
                  Minimum FCFA
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Tranches - Main Content */}
        <section className="pb-20" aria-label="Tranches d'investissement APE">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="sama-heading-section mb-6">
                Choisissez Votre Tranche d'Investissement
              </h2>
              <p className="sama-body-large max-w-3xl mx-auto">
                4 options d'investissement adaptées à vos objectifs financiers
                avec des rendements garantis par l'État
              </p>
            </div>

            {/* Tranches Grid */}
            <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
              <div className="grid md:grid-cols-4 gap-6">
                {trancheOptions.map((option, index) => {
                  const colors = [
                    { bg: "bg-green-500", text: "text-white" }, // Emission A - Green
                    { bg: "bg-yellow-400", text: "text-black" }, // Emission B - Yellow
                    { bg: "bg-red-600", text: "text-white" }, // Emission C - Red
                    { bg: "bg-gray-700", text: "text-white" }, // Emission D - Dark Gray
                  ];
                  const color = colors[index];

                  return (
                    <div
                      key={option.value}
                      className="bg-white rounded-2xl border border-timberwolf/20 p-6 hover:shadow-lg transition-all duration-300 group"
                    >
                      {/* Header with colored background */}
                      <div
                        className={`${color.bg} rounded-t-2xl -m-6 mb-4 p-4 ${color.text}`}
                      >
                        <h4 className="font-bold text-lg uppercase">
                          Emission {option.value}
                        </h4>
                      </div>

                      {/* Interest Rate */}
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-night mb-2">
                          {option.rate}%
                        </div>
                        <div className="text-sm text-night/60">
                          SUR {option.term} ANS
                        </div>
                      </div>

                      {/* Nominal Value */}
                      <div className="border-t border-timberwolf/20 pt-4 mb-6">
                        <div className="text-sm text-night/60 mb-1">
                          VALEUR NOMINALE:
                        </div>
                        <div className="font-bold text-night">10 000 FCFA*</div>
                      </div>

                      {/* Emission Amount */}
                      <div className="mb-6">
                        <div className="text-sm text-night/60 mb-1">
                          Montant de l'émission:
                        </div>
                        <div className="font-bold text-night">
                          {option.value === "A" && "60 milliards de FCFA"}
                          {option.value === "B" && "100 milliards de FCFA"}
                          {option.value === "C" && "80 milliards de FCFA"}
                          {option.value === "D" && "60 milliards de FCFA"}
                        </div>
                      </div>

                      {/* Invest Button */}
                      <button
                        onClick={() => handleTrancheSelection(option.value)}
                        className="w-full bg-gold-metallic text-white py-3 px-4 rounded-lg font-semibold hover:bg-gold-dark transition-colors flex items-center justify-center space-x-2 group-hover:scale-105 transform duration-200"
                      >
                        <span>J'investis</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
