"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useContactForm } from "../../hooks/useContactForm";
import { Header } from "./Header";
import { Footer } from "./Footer";
import DocumentationSection from "./DocumentationSection";
import { countries } from "../data/countries";

// Dynamically import ContactForm to reduce initial bundle size
const ContactForm = dynamic(() => import("./ContactForm").then(mod => ({ default: mod.ContactForm })), {
  loading: () => (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sama-accent-gold"></div>
    </div>
  ),
  ssr: false,
});

// Custom hook for count-up animation
const useCountUp = (end: number, duration: number): number => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frameId: number;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(end * progress);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [end, duration]);

  return value;
};

// Static background for Investment Tranches section - uses optimized image
const InvestmentTranchesBackground = (): React.ReactElement => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src="/new-daba-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        priority={false}
        quality={85}
      />
      {/* Subtle overlay for better text contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
    </div>
  );
};

export default function APE() {
  const { formData, updateFormData, setTrancheInteret, submitForm, isSubmitting, errors, resetForm } = useContactForm();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);
  const [subscriptionRef, setSubscriptionRef] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  // Animation values
  const animationDuration = 1800;
  const animatedProgrammeTotal = useCountUp(400, animationDuration);
  const animatedRendementMax = useCountUp(6.95, animationDuration);
  const animatedMinimum = useCountUp(10000, animationDuration);
  const animatedTrancheRate1 = useCountUp(6.4, animationDuration);
  const animatedTrancheRate2 = useCountUp(6.6, animationDuration);
  const animatedTrancheRate3 = useCountUp(6.75, animationDuration);
  const animatedTrancheRate4 = useCountUp(6.95, animationDuration);

  const investmentTranches = [
    {
      id: "1",
      duration: "3 ans",
      coupon: 6.4,
      rate: 6.40,
      amount: "85 milliards FCFA",
      nominalValue: "10 000 FCFA",
      additionalInfo: {
        maturite: "2028",
        differe: "Aucun",
        duration: "3 ans",
        remboursement: "Remboursement In fine",
      },
    },
    {
      id: "2",
      duration: "5 ans",
      coupon: 6.6,
      rate: 6.60,
      amount: "125 milliards FCFA",
      nominalValue: "10 000 FCFA",
      additionalInfo: {
        maturite: "2030",
        differe: "1 an",
        duration: "5 ans",
        remboursement: "1 an de différé",
      },
    },
    {
      id: "3",
      duration: "7 ans",
      coupon: 6.75,
      rate: 6.75,
      amount: "105 milliards FCFA",
      nominalValue: "10 000 FCFA",
      additionalInfo: {
        maturite: "2032",
        differe: "2 ans",
        duration: "7 ans",
        remboursement: "2 ans de différé",
      },
    },
    {
      id: "4",
      duration: "10 ans",
      coupon: 6.95,
      rate: 6.95,
      amount: "85 milliards FCFA",
      nominalValue: "10 000 FCFA",
      additionalInfo: {
        maturite: "2035",
        differe: "2 ans",
        duration: "10 ans",
        remboursement: "2 ans de différé",
      },
    },
  ];

  // Professional categories for the form
  const professionalCategories = [
    "Agriculteurs exploitants",
    "Artisans, commerçants, chefs d'entreprise",
    "Cadres et professions intellectuelles supérieures",
    "Professions intermédiaires",
    "Employés",
    "Ouvriers",
    "Retraités",
    "Autres personnes sans activité professionnelle",
    "Salarié",
    "Entrepreneur",
    "Profession libérale",
    "Travailleur autonome",
    "Étudiant",
    "Stagiaire non rémunéré",
  ];

  const selectedCountryData = countries.find(
    (country) => country.code === formData.pays_residence
  );

  const handlePhoneChange = (value: string) => {
    const selectedCode = selectedCountryData?.phoneCode || "+221";
    let cleanValue = value;

    if (value.startsWith(selectedCode)) {
      cleanValue = value.substring(selectedCode.length).trim();
    } else if (value.startsWith("+")) {
      const plusIndex = value.indexOf("+");
      cleanValue = value.substring(plusIndex + 1).trim();
      cleanValue = cleanValue.replace(/^[0-9]+\s*/, "");
    }

    cleanValue = cleanValue.replace(/\D/g, "");
    updateFormData("telephone", cleanValue);
  };

  const getDisplayPhoneValue = () => {
    if (!selectedCountryData) return formData.telephone;
    if (formData.telephone === "") return selectedCountryData.phoneCode;
    return `${selectedCountryData.phoneCode} ${formData.telephone}`;
  };

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const formatRate = (rate: number) => {
    return rate.toFixed(2).replace(".", ",");
  };

  const handleAmountChange = (value: string) => {
    const formattedValue = formatAmount(value);
    updateFormData("montant_cfa", formattedValue);
  };

  // Open contact form modal and set selected tranche
  const scrollToFormWithTranche = (trancheId: string) => {
    setTrancheInteret(`Tranche ${trancheId}`);
    setIsFormOpen(true);
    // Load payment scripts when form opens (deferred loading)
    loadPaymentScripts();
  };

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFormOpen]);

  // Handle form submission - creates subscription and triggers Intouch payment
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);
    
    const result = await submitForm();
    
    if (!result.success) {
      setSubmitMessage(result.message);
      return;
    }

    if (result.subscription) {
      const { referenceNumber, amount } = result.subscription;
      setSubscriptionRef(referenceNumber);
      setPaymentPending(true);
      
      // Update subscription status to payment initiated
      await fetch('/api/ape/subscribe', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceNumber,
          status: 'PAYMENT_INITIATED',
        }),
      });

      // Trigger Intouch payment
      triggerIntouchPayment(referenceNumber, amount);
    }
  };

  // Trigger Intouch payment portal
  const triggerIntouchPayment = (referenceNumber: string, amount: number) => {
    // Check if Intouch script is loaded
    if (typeof window !== 'undefined' && typeof (window as any).sendPaymentInfos === 'function') {
      // Construct redirect URLs
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/apesenegal/payment-success?referenceNumber=${encodeURIComponent(referenceNumber)}&amount=${amount}&status=success`;
      const failedUrl = `${baseUrl}/apesenegal/payment-failed?referenceNumber=${encodeURIComponent(referenceNumber)}&status=failed`;

      console.log('[APE Payment] Initiating Intouch payment:', {
        referenceNumber,
        amount,
        successUrl,
        failedUrl,
      });

      // Fetch all config from API (environment-aware)
      fetch('/api/payments/intouch/config')
        .then(res => res.json())
        .then(config => {
          if (config.error) {
            console.error('[APE Payment] Config error:', config.error);
            setSubmitMessage(config.error);
            setPaymentPending(false);
            return;
          }

          if (config.apiKey && config.merchantId) {
            console.log(`[APE Payment] Using ${config.environment} environment`);
            (window as any).sendPaymentInfos(
              referenceNumber,       // order number
              config.merchantId,     // agency code
              config.apiKey,         // secure code
              config.domain,         // domain name
              successUrl,            // url success
              failedUrl,             // url failed
              Number(amount),        // amount
              'Dakar',               // city
              formData.email,        // email
              formData.prenom,       // firstName
              formData.nom,          // lastName
              formData.telephone     // phone
            );
          } else {
            console.error('[APE Payment] Missing Intouch configuration');
            setSubmitMessage('Configuration de paiement manquante. Veuillez réessayer.');
            setPaymentPending(false);
          }
        })
        .catch(err => {
          console.error('[APE Payment] Error fetching config:', err);
          setSubmitMessage('Erreur lors de l\'initialisation du paiement.');
          setPaymentPending(false);
        });
    } else {
      console.error('[APE Payment] Intouch script not loaded');
      setSubmitMessage('Le système de paiement n\'est pas disponible. Veuillez rafraîchir la page.');
      setPaymentPending(false);
    }
  };

  // Load payment scripts on demand (deferred until form opens)
  const loadPaymentScripts = useCallback(() => {
    if (typeof window === 'undefined') return Promise.resolve();
    if ((window as any).sendPaymentInfos) return Promise.resolve();

    // Load CryptoJS first (required by Intouch)
    const loadCryptoJS = () => {
      return new Promise<void>((resolve, reject) => {
        if ((window as any).CryptoJS) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load CryptoJS'));
        document.head.appendChild(script);
      });
    };

    // Load Intouch script
    const loadIntouch = () => {
      return new Promise<void>((resolve, reject) => {
        if ((window as any).sendPaymentInfos) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://touchpay.gutouch.net/touchpayv2/script/touchpaynr/prod_touchpay-0.0.1.js';
        script.onload = () => {
          setTimeout(() => {
            if ((window as any).sendPaymentInfos) {
              resolve();
            } else {
              reject(new Error('sendPaymentInfos not available'));
            }
          }, 500);
        };
        script.onerror = () => reject(new Error('Failed to load Intouch script'));
        document.head.appendChild(script);
      });
    };

    return loadCryptoJS()
      .then(() => loadIntouch())
      .then(() => console.log('[APE] Intouch payment scripts loaded'))
      .catch(err => console.error('[APE] Error loading payment scripts:', err));
  }, []);

  const trancheOptions = [
    {
      value: "1" as const,
      label: "Tranche 1",
      term: 3,
      rate: 6.4,
      description: "Court terme - 3 ans",
      amount: "85 milliards FCFA",
      remboursement: "Remboursement In fine",
    },
    {
      value: "2" as const,
      label: "Tranche 2",
      term: 5,
      rate: 6.6,
      description: "Moyen terme - 5 ans",
      amount: "125 milliards FCFA",
      remboursement: "1 an de différé",
    },
    {
      value: "3" as const,
      label: "Tranche 3",
      term: 7,
      rate: 6.75,
      description: "Long terme - 7 ans",
      amount: "105 milliards FCFA",
      remboursement: "2 ans de différé",
    },
    {
      value: "4" as const,
      label: "Tranche 4",
      term: 10,
      rate: 6.95,
      description: "Très long terme - 10 ans",
      amount: "85 milliards FCFA",
      remboursement: "2 ans de différé",
    },
  ];

  // Tranches data for the ContactForm
  const tranches = trancheOptions.map((t) => ({
    id: t.value,
    duration: `${t.term} ans`,
    rate: t.rate,
  }));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main id="main">
        <section
          className="relative w-full bg-white"
          aria-label="APE Hero"
        >
          {/* Background Image */}
          <div className="relative w-full h-auto">
            <Image
              src="/Hero-03.png"
              alt="APE - Emprunt Obligataire État du Sénégal"
              width={1920}
              height={600}
              sizes="100vw"
              className="w-full h-auto object-contain"
              priority
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAGABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIRAAAgEEAQUBAAAAAAAAAAAAAQIDAAQFESEGEhMxQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzLpzqK9w2QjuLaRlKnTKT2sD8I+VoGN6/wAhkMfBcSRQq0qBiEBIBI3wTSlKy4x1YgnstYlmWf/Z"
            />
          </div>
        </section>

        {/* Key Stats Section - Enhanced with animations */}
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
                  {Math.round(animatedProgrammeTotal)} Milliards
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
                  {animatedRendementMax.toFixed(2).replace(".", ",")}%
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
                  {Math.round(animatedMinimum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </div>
                <div className="sama-body-small uppercase tracking-wider font-medium">
                  Minimum FCFA
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Tranches - Main Content with animated background */}
        <section className="relative py-16 sm:py-20" aria-label="Tranches d'investissement APE">
          <InvestmentTranchesBackground />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center text-white mb-10">
              <h2 className="sama-heading-section mb-4 !text-white">
                Choisissez Votre Tranche d'Investissement
              </h2>
              <p className="sama-body-large max-w-3xl mx-auto text-white/80">
                4 options d'investissement adaptées à vos objectifs financiers
                avec des rendements garantis par l'État
              </p>
            </div>

            {/* Tranches Grid */}
            <div className="bg-transparent rounded-2xl p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-4">
                {trancheOptions.map((option, index) => {
                  const animatedRates = [
                    animatedTrancheRate1,
                    animatedTrancheRate2,
                    animatedTrancheRate3,
                    animatedTrancheRate4,
                  ];
                  const animatedRate = animatedRates[index];
                  const colors = [
                    { bg: "bg-[#288645]", text: "text-white" }, // Emission A - Green
                    { bg: "bg-gold-metallic", text: "text-white" }, // Emission B - Gold
                    { bg: "bg-[#c42f30]", text: "text-white" }, // Emission C - Red
                    { bg: "bg-[#2e0635]", text: "text-white" }, // Emission D - Dark Purple
                  ];
                  const color = colors[index];

                  return (
                    <div
                      key={option.value}
                      className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
                    >
                      {/* Header with colored background */}
                      <div
                        className={`${color.bg} rounded-t-2xl -m-6 mb-4 p-4 ${color.text}`}
                      >
                        <h4 className="font-bold text-lg uppercase">
                          TRANCHE {option.value}
                        </h4>
                        <div className="text-xs font-medium tracking-wide mt-1">
                          SUR {option.term} ANS
                        </div>
                      </div>

                      {/* Interest Rate */}
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-night mb-2">
                          {formatRate(animatedRate)}%
                        </div>
                      </div>

                      {/* Emission Amount */}
                      <div className="mb-6">
                        <div className="text-sm text-night/60 mb-1">Montant</div>
                        <div className="font-bold text-night text-xl">
                          {option.amount}
                        </div>
                      </div>

                      {/* Remboursement / Différé info */}
                      <div className="border-t border-timberwolf/20 pt-4 mb-6">
                        <div className="text-sm text-night/80 font-medium">
                          {option.remboursement}
                        </div>
                      </div>

                      {/* Invest Button */}
                      <button
                        onClick={() => scrollToFormWithTranche(option.value)}
                        className="w-full bg-gold-metallic text-white py-3 px-4 rounded-lg font-semibold hover:bg-gold-dark transition-colors flex items-center justify-center space-x-2 group-hover:scale-105 transform duration-200"
                      >
                        <span>J'investis</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Nominal value info */}
              <div className="mt-6 text-center text-sm text-white font-medium">
                Exonération pour le résident sénégalais
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <DocumentationSection />
      </main>

      {/* Contact Form Modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-md pt-[130px] md:pt-[120px]"
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[calc(100vh-120px)] md:max-h-[calc(100vh-140px)] overflow-y-auto px-4"
            onClick={(e) => e.stopPropagation()}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute right-6 top-6 z-50 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-gray-700 shadow hover:bg-white"
            >
              Fermer
            </button>
            <ContactForm
              formData={formData}
              updateFormData={updateFormData}
              handleFormSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
              professionalCategories={professionalCategories}
              countries={countries}
              selectedCountryData={selectedCountryData}
              getDisplayPhoneValue={getDisplayPhoneValue}
              handlePhoneChange={handlePhoneChange}
              handleAmountChange={handleAmountChange}
              tranches={tranches}
              errors={errors}
              submitMessage={submitMessage}
              paymentPending={paymentPending}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
