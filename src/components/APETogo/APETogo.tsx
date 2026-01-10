"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  ArrowDownTrayIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/APE/Header";
import { Footer } from "@/components/APE/Footer";
import { useContactForm } from "../../hooks/useContactForm";
import { countries } from "../data/countries";

// Dynamically import ContactForm to reduce initial bundle size
const ContactForm = dynamic(() => import("../APE/ContactForm").then(mod => ({ default: mod.ContactForm })), {
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
    </div>
  );
};

interface DocumentCard {
  id: string;
  title: string;
  subtitle: string;
  previewImage: string;
  downloadUrl: string;
}

const documents: DocumentCard[] = [
  {
    id: "note",
    title: "NOTE D'INFORMATION",
    subtitle: "Appel Public à l'Épargne État du Togo 2026",
    previewImage: "/apetogo/previews/note-etat-du-togo-2026.png",
    downloadUrl: "/apetogo/NOTE ETAT DU TOGO 2026.pdf",
  },
  {
    id: "depliant",
    title: "DÉPLIANT",
    subtitle: "Appel Public à l'Épargne État du Togo 2026-2031",
    previewImage: "/apetogo/previews/depliant-etat-du-togo-2026-2031.png",
    downloadUrl: "/apetogo/DEPLIANT ETAT DU TOGO 2026-2031 (4).pdf",
  },
  {
    id: "bulletin",
    title: "BULLETIN DE SOUSCRIPTION",
    subtitle: "Appel Public à l'Épargne État du Togo 2026-2031",
    previewImage: "/apetogo/previews/bulletin-de-souscription-etat-du-togo-2026-2031.png",
    downloadUrl: "/apetogo/BULLETIN DE SOUSCRIPTION ETAT DU TOGO 2.pdf",
  },
];

// Investment tranche data for Togo (from banner: Tranche 1 - 20 Milliards, 6.50%, 2026-2031)
const investmentTranches = [
  {
    id: "1",
    name: "Tranche 1",
    duration: "5 ans",
    coupon: 6.5,
    rate: 6.5,
    amount: "20 milliards FCFA",
    nominalValue: "10 000 FCFA",
    additionalInfo: {
      remboursement: "Net pour les résidents du Togo",
    },
  },
  {
    id: "2",
    name: "Tranche 2",
    duration: "7 ans",
    coupon: 6.7,
    rate: 6.7,
    amount: "40 milliards FCFA",
    nominalValue: "10 000 FCFA",
    additionalInfo: {
      remboursement: "Net pour les résidents du Togo",
    },
  },
];

export default function APETogo() {
  const { formData, updateFormData, setTrancheInteret, submitForm, isSubmitting, errors, resetForm } = useContactForm();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  
  // Animation values
  const animationDuration = 1800;
  const animatedProgrammeTotal = useCountUp(60, animationDuration);
  const animatedRendementMax = useCountUp(6.7, animationDuration);
  const animatedMinimum = useCountUp(10000, animationDuration);
  const animatedTrancheRate1 = useCountUp(6.5, animationDuration);
  const animatedTrancheRate2 = useCountUp(6.7, animationDuration);

  const formatRate = (rate: number) => {
    return rate.toFixed(2).replace(".", ",");
  };

  const selectedCountryData = countries.find(
    (country) => country.code === formData.pays_residence
  );

  const handlePhoneChange = (value: string) => {
    const selectedCode = selectedCountryData?.phoneCode || "+228";
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

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    updateFormData("montant_cfa", formattedValue);
  };

  // Open contact form modal and set selected tranche
  const scrollToFormWithTranche = (trancheId: string) => {
    setTrancheInteret(`Tranche ${trancheId}`);
    setIsFormOpen(true);
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

  // Handle form submission
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
    if (typeof window !== 'undefined' && typeof (window as any).sendPaymentInfos === 'function') {
      const baseUrl = window.location.origin;
      const statusUrl = `${baseUrl}/ape/payment-status?referenceNumber=${referenceNumber}&amount=${amount}&source=intouch`;

      fetch('/api/payments/intouch/config')
        .then(res => res.json())
        .then(config => {
          if (config.error) {
            setSubmitMessage(config.error);
            setPaymentPending(false);
            return;
          }

          if (config.apiKey && config.merchantId) {
            (window as any).sendPaymentInfos(
              referenceNumber,
              config.merchantId,
              config.apiKey,
              config.domain,
              statusUrl,
              statusUrl,
              Number(amount),
              'Lomé',
              formData.email,
              formData.prenom,
              formData.nom,
              formData.telephone
            );
          } else {
            setSubmitMessage('Configuration de paiement manquante. Veuillez réessayer.');
            setPaymentPending(false);
          }
        })
        .catch(err => {
          setSubmitMessage('Erreur lors de l\'initialisation du paiement.');
          setPaymentPending(false);
        });
    } else {
      setSubmitMessage('Le système de paiement n\'est pas disponible. Veuillez rafraîchir la page.');
      setPaymentPending(false);
    }
  };

  // Load payment scripts on demand
  const loadPaymentScripts = useCallback(() => {
    if (typeof window === 'undefined') return Promise.resolve();
    if ((window as any).sendPaymentInfos) return Promise.resolve();

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
      .then(() => console.log('[APE Togo] Intouch payment scripts loaded'))
      .catch(err => console.error('[APE Togo] Error loading payment scripts:', err));
  }, []);

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

  // Tranches data for the ContactForm
  const tranches = investmentTranches.map((t) => ({
    id: t.id,
    duration: t.duration,
    rate: t.rate,
  }));

  const handleDownload = (downloadUrl: string, title: string) => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = title.toLowerCase().replace(/\s+/g, "_") + ".pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main id="main">
        {/* Hero Section - Banner */}
        <section className="relative w-full bg-white" aria-label="APE Togo Hero">
          <div className="relative w-full h-auto">
            <Image
              src="/apetogo/Banner-web-03.png"
              alt="APE - Emprunt Obligataire par Appel Public à l'Épargne Trésor Public du Togo"
              width={1920}
              height={600}
              sizes="100vw"
              className="w-full h-auto object-contain"
              priority
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAGABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIRAAAgEEAQUBAAAAAAAAAAAAAQIDAAQFESEGEhMxQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzLpzqK9w2QjuLaRlKnTKT2sD8I+VoGN6/wAhkMfBcSRQq0qBiEBIBI3wTSlKy4x1YgnstYlmWf/Z"
            />
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-gray-50 to-white" aria-label="Statistiques clés">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="sama-heading-section mb-4">
                Programme d'Émission
              </h2>
              <p className="sama-body-large max-w-2xl mx-auto">
                Ensemble, investissons pour soutenir le Togo de demain
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="sama-card-feature text-center p-8 group">
                <div className="w-16 h-16 bg-[#006A4E] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BanknotesIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-[#006A4E] mb-2">
                  {Math.round(animatedProgrammeTotal)} Milliards
                </div>
                <div className="sama-body-small uppercase tracking-wider font-medium">
                  Montant de l'opération FCFA
                </div>
              </div>

              <div className="sama-card-feature text-center p-8 group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#006A4E] to-[#004d38] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ArrowTrendingUpIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-[#006A4E] mb-2">
                  {animatedRendementMax.toFixed(2).replace(".", ",")}%
                </div>
                <div className="sama-body-small uppercase tracking-wider font-medium">
                  Rendement Maximum
                </div>
              </div>

              <div className="sama-card-feature text-center p-8 group">
                <div className="w-16 h-16 bg-[#C42F30] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircleIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-[#C42F30] mb-2">
                  {Math.round(animatedMinimum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </div>
                <div className="sama-body-small uppercase tracking-wider font-medium">
                  Prix de l'obligation FCFA
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-16 sm:py-20" aria-label="Tranches d'investissement APE Togo">
          <InvestmentTranchesBackground />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center text-white mb-10">
              <h2 className="sama-heading-section mb-4 !text-white">
                Choisissez Votre Tranche d'Investissement
              </h2>
              <p className="sama-body-large max-w-3xl mx-auto text-white/80">
                2 options d'investissement adaptées à vos objectifs financiers
              </p>
            </div>

            <div className="bg-transparent rounded-2xl p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                {investmentTranches.map((tranche, index) => {
                  const animatedRate = index === 0 ? animatedTrancheRate1 : animatedTrancheRate2;
                  const colors = [
                    {
                      bg: "bg-[#006A4E]",
                      text: "text-white",
                      button: "bg-[#006A4E] hover:bg-[#004d38]",
                    },
                    {
                      bg: "bg-[#C42F30]",
                      text: "text-white",
                      button: "bg-[#C42F30] hover:bg-[#A61F20]",
                    },
                  ];
                  const color = colors[index];

                  return (
                    <div
                      key={tranche.id}
                      className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className={`${color.bg} rounded-t-2xl -m-6 mb-6 p-5 ${color.text} text-center`}>
                        <h4 className="font-bold text-xl uppercase">
                          TRANCHE {tranche.id}
                        </h4>
                        <div className="text-sm font-medium tracking-wide mt-2">
                          SUR {tranche.duration}
                        </div>
                      </div>

                      <div className="text-center mb-8">
                        <div className="text-5xl font-bold text-night mb-2">
                          {formatRate(animatedRate)}%
                        </div>
                      </div>

                      <div className="text-center mb-8">
                        <div className="text-base text-night/60 mb-2">Montant</div>
                        <div className="font-bold text-night text-2xl">
                          {tranche.amount}
                        </div>
                      </div>

                      <div className="border-t border-timberwolf/20 pt-6 mb-8 text-center">
                        <div className="text-base text-night/80 font-medium">
                          {tranche.additionalInfo.remboursement}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => scrollToFormWithTranche(tranche.id)}
                          className={`w-full ${color.button} text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 group-hover:scale-105 transform duration-200`}
                        >
                          <span>Souscrire maintenant</span>
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDownload("/apetogo/BULLETIN DE SOUSCRIPTION ETAT DU TOGO 2.pdf", "Bulletin de Souscription");
                          }}
                          className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                          <span>Télécharger le bulletin</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 text-center text-sm text-white font-medium">
                Net pour les résidents du Togo
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section className="relative py-24 bg-gradient-to-b from-white to-gray-50" aria-label="Documentation opérationnelle">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Documentation Officielle
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Accédez à tous les documents réglementaires de l'opération
              </p>
              <div className="h-1 w-16 bg-gradient-to-r from-[#C42F30] to-[#006A4E] mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {documents.map((doc, index) => (
                <div
                  key={doc.id}
                  onClick={() => handleDownload(doc.downloadUrl, doc.title)}
                  className="group cursor-pointer relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#006A4E] to-[#C42F30] rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500" />
                  
                  <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 transition-all duration-500 group-hover:border-transparent group-hover:shadow-2xl group-hover:-translate-y-2">
                    {/* Document preview */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <Image
                        src={doc.previewImage}
                        alt={`Aperçu ${doc.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        loading="lazy"
                        className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Download indicator */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <ArrowDownTrayIcon className="w-8 h-8 text-[#C42F30]" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center">
                      <h3 className="font-bold text-base text-gray-900 mb-2 tracking-wide group-hover:text-[#006A4E] transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{doc.subtitle}</p>
                      
                      <div className="mt-4 inline-flex items-center gap-2 text-[#C42F30] font-semibold text-sm">
                        <span>Télécharger</span>
                        <ArrowDownTrayIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="relative py-24 sm:py-32 overflow-hidden" aria-label="Contact">
          {/* Sophisticated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#004d38] via-[#006A4E] to-[#003d2f]" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C42F30] rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1D943C] rounded-full blur-3xl" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
          
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Des questions ?
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Notre équipe d'experts est disponible pour vous accompagner dans votre investissement
            </p>
            
            <Link
              href="https://everestfin.com/contact/"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#C42F30] to-[#A61F20] text-white px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-[#C42F30]/50 transition-all duration-300 hover:scale-105"
            >
              <span>Nous contacter</span>
              <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
            
            {/* Decorative element */}
            <div className="mt-12 flex items-center justify-center gap-8 text-white/50 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/50 rounded-full" />
                <span>Réponse rapide</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/50 rounded-full" />
                <span>Accompagnement personnalisé</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer isApe={true} />

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
    </div>
  );
}
