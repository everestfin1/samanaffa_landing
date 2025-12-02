import React, { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { countries } from "../../data/countries";
import { useContactForm, type FormData } from "../../hooks/useContactForm";
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import {
  Banknote,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

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

type InvestmentTranchesBackgroundProps = {
  prefersReducedMotion: boolean;
};

const InvestmentTranchesBackground = ({ prefersReducedMotion }: InvestmentTranchesBackgroundProps): JSX.Element => {
  const shouldAnimate = !prefersReducedMotion;

  const waves = [
    // Row 1 - Top (multi-peak, very accentuated)
    { path: "M 0 200 Q 120 40 240 200 T 480 200 T 720 200 T 960 200 T 1200 200 T 1440 200", opacity: 0.14, strokeWidth: 0.8, duration: 16 },
    { path: "M 0 230 Q 120 70 240 230 T 480 230 T 720 230 T 960 230 T 1200 230 T 1440 230", opacity: 0.16, strokeWidth: 0.8, duration: 17 },
    { path: "M 0 260 Q 120 100 240 260 T 480 260 T 720 260 T 960 260 T 1200 260 T 1440 260", opacity: 0.18, strokeWidth: 0.8, duration: 18 },
    { path: "M 0 290 Q 120 130 240 290 T 480 290 T 720 290 T 960 290 T 1200 290 T 1440 290", opacity: 0.20, strokeWidth: 0.8, duration: 19 },

    // Row 2 - Middle (strong)
    { path: "M 0 320 Q 120 160 240 320 T 480 320 T 720 320 T 960 320 T 1200 320 T 1440 320", opacity: 0.22, strokeWidth: 0.8, duration: 20 },
    { path: "M 0 350 Q 120 190 240 350 T 480 350 T 720 350 T 960 350 T 1200 350 T 1440 350", opacity: 0.24, strokeWidth: 0.8, duration: 21 },
    { path: "M 0 380 Q 120 220 240 380 T 480 380 T 720 380 T 960 380 T 1200 380 T 1440 380", opacity: 0.26, strokeWidth: 0.8, duration: 22 },
    { path: "M 0 410 Q 120 250 240 410 T 480 410 T 720 410 T 960 410 T 1200 410 T 1440 410", opacity: 0.28, strokeWidth: 0.8, duration: 23 },

    // Row 3 - Bottom (moderate)
    { path: "M 0 440 Q 120 280 240 440 T 480 440 T 720 440 T 960 440 T 1200 440 T 1440 440", opacity: 0.30, strokeWidth: 0.8, duration: 24 },
    { path: "M 0 470 Q 120 310 240 470 T 480 470 T 720 470 T 960 470 T 1200 470 T 1440 470", opacity: 0.32, strokeWidth: 0.8, duration: 25 },
    { path: "M 0 500 Q 120 340 240 500 T 480 500 T 720 500 T 960 500 T 1200 500 T 1440 500", opacity: 0.34, strokeWidth: 0.8, duration: 26 },
    { path: "M 0 530 Q 120 370 240 530 T 480 530 T 720 530 T 960 530 T 1200 530 T 1440 530", opacity: 0.36, strokeWidth: 0.8, duration: 27 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#3b0b8a] via-[#23054a] to-black" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="tranche-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C4A1FF" />
            <stop offset="45%" stopColor="#E5D4FF" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          <pattern
            id="tranche-grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
            />
          </pattern>

          <filter
            id="tranche-glow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.4 0"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x="0"
          y="0"
          width="1440"
          height="600"
          fill="url(#tranche-grid)"
          opacity="0.18"
        />

        <g transform="rotate(-14 720 320)">
          {waves.map((wave, index) => (
            <motion.path
              key={index}
              d={wave.path}
              fill="none"
              stroke="url(#tranche-line-gradient)"
              strokeWidth={wave.strokeWidth}
              opacity={wave.opacity}
              filter="url(#tranche-glow)"
              initial={
                shouldAnimate
                  ? { pathLength: 0, opacity: 0 }
                  : undefined
              }
              animate={
                shouldAnimate
                  ? {
                      pathLength: 1,
                      opacity: wave.opacity,
                      x: ["-2%", "2%", "-2%"],
                    }
                  : undefined
              }
              transition={
                shouldAnimate
                  ? {
                      pathLength: { duration: 2.4 + index * 0.5, ease: "easeOut" },
                      x: {
                        duration: wave.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }
                  : undefined
              }
            />
          ))}
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  );
}
;

export const LandingPageApe = (): JSX.Element => {
  const { formData, updateFormData, setTrancheInteret, submitForm, isSubmitting, errors } = useContactForm();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [heroOffset, setHeroOffset] = useState(0);

  const prefersReducedMotion = useReducedMotion();

  const animationDuration = 1800;
  const animatedProgrammeTotal = useCountUp(400, animationDuration);
  const animatedRendementMax = useCountUp(6.95, animationDuration);
  const animatedMinimum = useCountUp(10000, animationDuration);
  const animatedTrancheRate1 = useCountUp(6.4, animationDuration);
  const animatedTrancheRate2 = useCountUp(6.6, animationDuration);
  const animatedTrancheRate3 = useCountUp(6.75, animationDuration);
  const animatedTrancheRate4 = useCountUp(6.95, animationDuration);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      setHeroOffset(scrollTop * 0.3);
    };

    window.addEventListener('scroll', handleScroll, { passive: true } as AddEventListenerOptions);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll as EventListenerOrEventListenerObject);
    };
  }, []);

  // Investment tranches data
  const tranches = [
    {
      id: "1",
      duration: "3 ans",
      rate: 6.40,
      amount: "85 milliards FCFA",
      nominalValue: "10 000 FCFA",
      additionalInfo: {
        maturite: "2028",
        differe: "Aucun",
        duration: "3 ans",
        remboursement: "Remboursement In fine"
      }
    },
    {
      id: "2",
      duration: "5 ans",
      rate: 6.60,
      amount: "125 milliards FCFA",
      nominalValue: "10 000 FCFA",
      additionalInfo: {
        maturite: "2030",
        differe: "1 an",
        duration: "5 ans",
        remboursement: "1 an de différé"
      }
    },
    {
      id: "3",
      duration: "7 ans",
      rate: 6.75,
      amount: "105 milliards FCFA",
      nominalValue: "10 000 FCFA",
      additionalInfo: {
        maturite: "2032",
        differe: "2 ans",
        duration: "7 ans",
        remboursement: "2 ans de différé"
      }
    },
    {
      id: "4",
      duration: "10 ans",
      rate: 6.95,
      amount: "85 milliards FCFA",
      nominalValue: "10 000 FCFA",
      additionalInfo: {
        maturite: "2035",
        differe: "2 ans",
        duration: "10 ans",
        remboursement: "2 ans de différé"
      }
    },
  ];

  // Professional categories
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
    "Stagiaire non rémunéré"
  ];

  const selectedCountryData = countries.find((country: { code: string; }) => country.code === formData.pays_residence);

  const handlePhoneChange = (value: string) => {
    // Extract only the digits from the input, removing the country code if present
    const selectedCode = selectedCountryData?.phoneCode || '+221';
    let cleanValue = value;
    
    // If the value starts with the country code, remove it
    if (value.startsWith(selectedCode)) {
      cleanValue = value.substring(selectedCode.length).trim();
    } else if (value.startsWith('+')) {
      // If it starts with + but not the full country code, handle it differently
      const plusIndex = value.indexOf('+');
      cleanValue = value.substring(plusIndex + 1).trim();
      // Try to remove any partial country code
      cleanValue = cleanValue.replace(/^[0-9]+\s*/, '');
    }
    
    // Further clean the value to only contain digits
    cleanValue = cleanValue.replace(/\D/g, '');
    
    updateFormData('telephone', cleanValue);
  };

  const getDisplayPhoneValue = () => {
    if (!selectedCountryData) return formData.telephone;
    
    // If user is in the middle of typing, just show what they're typing
    if (formData.telephone === '') return selectedCountryData.phoneCode;
    
    // Show country code + space + phone number
    return `${selectedCountryData.phoneCode} ${formData.telephone}`;
  };

  // Function to format amount with spaces
  const formatAmount = (value: string) => {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');
    
    // Add spaces every 3 digits from the right
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const formatRate = (rate: number) => {
    return rate.toFixed(2).replace('.', ',');
  };

  const handleAmountChange = (value: string) => {
    const formattedValue = formatAmount(value);
    updateFormData('montant_cfa', formattedValue);
  };

  const initiateIntouchPayment = (snapshot: FormData) => {
    if (typeof window === 'undefined') {
      return;
    }

    const intouchFn = (window as any).sendPaymentInfos as
      | ((
        orderNumber: string,
        agencyCode: string,
        secureCode: string,
        domainName: string,
        urlRedirectionSuccess: string,
        urlRedirectionFailed: string,
        amount: number,
        city: string,
        email: string,
        clientFirstName: string,
        clientLastName: string,
        clientPhone: string
      ) => void)
      | undefined;

    if (typeof intouchFn !== 'function') {
      toast.error("Le système de paiement n'est pas disponible pour le moment. Veuillez réessayer plus tard.");
      return;
    }

    const rawAmount = snapshot.montant_cfa.replace(/\s/g, '');
    const amountNumber = Number(rawAmount);

    if (!rawAmount || Number.isNaN(amountNumber) || amountNumber <= 0) {
      return;
    }

    const orderNumber = `APE-INVEST-${Date.now()}`;

    const agencyCode = (import.meta as any).env?.VITE_INTOUCH_AGENCY_CODE as string | undefined;
    const secureCode = (import.meta as any).env?.VITE_INTOUCH_SECURE_CODE as string | undefined;

    if (!agencyCode || !secureCode) {
      toast.error("La configuration du paiement Intouch est incomplète. Veuillez réessayer plus tard.");
      return;
    }

    const domainName = (import.meta as any).env?.VITE_INTOUCH_DOMAIN_NAME || window.location.hostname;
    const successUrl = '';
    const failedUrl = '';

    const city = snapshot.ville || 'Dakar';
    const email = snapshot.email || '';
    const clientFirstName = snapshot.prenom || 'Client';
    const clientLastName = snapshot.nom || 'Everest';

    const phoneWithCode = selectedCountryData?.phoneCode
      ? `${selectedCountryData.phoneCode} ${snapshot.telephone}`
      : snapshot.telephone;

    const clientPhone = phoneWithCode.replace(/\s/g, '');

    intouchFn(
      orderNumber,
      agencyCode,
      secureCode,
      domainName,
      successUrl,
      failedUrl,
      amountNumber,
      city,
      email,
      clientFirstName,
      clientLastName,
      clientPhone
    );
  };

  // Open contact form modal and set selected tranche
  const scrollToFormWithTranche = (trancheId: string) => {
    setTrancheInteret(`Tranche ${trancheId}`);
    setIsFormOpen(true);
  };

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFormOpen]);

  // Function to open WhatsApp Business
  const openWhatsApp = () => {
    const phoneNumber = "221770993382";
    const message = encodeURIComponent("Bonjour, je souhaite obtenir des informations sur l'emprunt obligataire par appel public à l'épargne d'EVEREST Finance.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };


  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formSnapshot: FormData = { ...formData };
    const success = await submitForm();
    if (success) {
      // Optionally scroll to top or show additional success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      initiateIntouchPayment(formSnapshot);
    }
  };

  const trancheOptions = tranches.map((tranche) => ({
    value: tranche.id,
    label: `Tranche ${tranche.id}`,
    term: parseInt(tranche.duration),
    rate: tranche.rate,
    description: tranche.duration,
    amount: tranche.amount,
    nominalValue: tranche.nominalValue,
    additionalInfo: tranche.additionalInfo,
  }));

  return (
    <div className="min-h-screen">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#30461f',
            color: '#fff',
          },
          success: {
            style: {
              background: '#30461f',
            },
          },
          error: {
            style: {
              background: '#dc2626',
            },
          },
        }}
      />
      
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <main id="main">
        <section
          className="relative w-full bg-white overflow-hidden"
          aria-label="APE Hero"
        >
          {/* Background Image */}
          <div
            className="relative w-full h-auto"
            style={{ transform: `translateY(${heroOffset * -1}px)`, willChange: 'transform' }}
          >
            <img
              src="/apesenegal/Hero-03.png"
              alt="APE - Emprunt Obligataire État du Sénégal"
              className="w-full h-auto object-contain"
            />
          </div>
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
                  <Banknote className="w-8 h-8 text-white" />
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
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-[#435933] mb-2">
                  {animatedRendementMax.toFixed(2).replace('.', ',')}%
                </div>
                <div className="sama-body-small uppercase tracking-wider font-medium">
                  Rendement Maximum
                </div>
              </div>

              <div className="sama-card-feature text-center p-8 group">
                <div className="w-16 h-16 bg-sama-accent-gold rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-sama-accent-gold mb-2">
                  {Math.round(animatedMinimum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                </div>
                <div className="sama-body-small uppercase tracking-wider font-medium">
                  Minimum FCFA
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Tranches - Main Content */}
        <section className="relative py-16 sm:py-20" aria-label="Tranches d'investissement APE">
          <InvestmentTranchesBackground prefersReducedMotion={!!prefersReducedMotion} />
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
                        <div className="text-sm text-night/60 mb-1">
                          Montant
                        </div>
                        <div className="font-bold text-night text-xl">
                          {option.amount}
                        </div>
                      </div>

                      {/* Remboursement / Différé info */}
                      <div className="border-t border-timberwolf/20 pt-4 mb-6">
                        <div className="text-sm text-night/80 font-medium">
                          {option.additionalInfo.remboursement}
                        </div>
                      </div>

                      {/* Invest Button */}
                      <button
                        onClick={() => scrollToFormWithTranche(option.value)}
                        className="w-full bg-gold-metallic text-white py-3 px-4 rounded-lg font-semibold hover:bg-gold-dark transition-colors flex items-center justify-center space-x-2 group-hover:scale-105 transform duration-200"
                      >
                        <span>J'investis</span>
                        <ArrowRight className="w-4 h-4" />
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

        <Footer />
      </main>

      {/* Contact Form Modal */}
      {isFormOpen && (
        <div 
          className="fixed inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-md pt-[130px] md:pt-[120px]"
          onClick={() => setIsFormOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl max-h-[calc(100vh-120px)] md:max-h-[calc(100vh-140px)] overflow-y-auto px-4 no-scrollbar"
            onClick={(e) => e.stopPropagation()}
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
            />
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Contacter via WhatsApp"
      >
        <img
          src="/apesenegal/whatsapp.png"
          alt="WhatsApp"
          className="w-7 h-7"
        />
        <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Contactez-nous sur WhatsApp
        </span>
      </button>
    </div>
  );
};