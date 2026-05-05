'use client';

import { useState, useCallback, useEffect } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const countries = [
  { code: 'SN', name: 'Sénégal' },
  { code: 'FR', name: 'France' },
  { code: 'US', name: 'États-Unis' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'Royaume-Uni' },
  { code: 'DE', name: 'Allemagne' },
  { code: 'IT', name: 'Italie' },
  { code: 'ES', name: 'Espagne' },
  { code: 'NL', name: 'Pays-Bas' },
  { code: 'BE', name: 'Belgique' },
  { code: 'CH', name: 'Suisse' },
  { code: 'AT', name: 'Autriche' },
  { code: 'SE', name: 'Suède' },
  { code: 'NO', name: 'Norvège' },
  { code: 'DK', name: 'Danemark' },
  { code: 'FI', name: 'Finlande' },
  { code: 'PL', name: 'Pologne' },
  { code: 'CZ', name: 'République Tchèque' },
  { code: 'HU', name: 'Hongrie' },
  { code: 'RO', name: 'Roumanie' },
  { code: 'GR', name: 'Grèce' },
  { code: 'PT', name: 'Portugal' },
  { code: 'IE', name: 'Irlande' },
  { code: 'JP', name: 'Japon' },
  { code: 'CN', name: 'Chine' },
  { code: 'IN', name: 'Inde' },
  { code: 'BR', name: 'Brésil' },
  { code: 'MX', name: 'Mexique' },
  { code: 'AR', name: 'Argentine' },
  { code: 'CL', name: 'Chili' },
  { code: 'CO', name: 'Colombie' },
  { code: 'PE', name: 'Pérou' },
  { code: 'AU', name: 'Australie' },
  { code: 'NZ', name: 'Nouvelle-Zélande' },
  { code: 'SG', name: 'Singapour' },
  { code: 'MY', name: 'Malaisie' },
  { code: 'TH', name: 'Thaïlande' },
  { code: 'ID', name: 'Indonésie' },
  { code: 'PH', name: 'Philippines' },
  { code: 'VN', name: 'Viêt Nam' },
  { code: 'KR', name: 'Corée du Sud' },
  { code: 'AE', name: 'Émirats Arabes Unis' },
  { code: 'SA', name: 'Arabie Saoudite' },
  { code: 'IL', name: 'Israël' },
  { code: 'TR', name: 'Turquie' },
  { code: 'EG', name: 'Égypte' },
  { code: 'ZA', name: 'Afrique du Sud' },
  { code: 'NG', name: 'Nigéria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'ML', name: 'Mali' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'NE', name: 'Niger' },
  { code: 'TD', name: 'Tchad' },
  { code: 'CM', name: 'Cameroun' },
  { code: 'GA', name: 'Gabon' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'République Démocratique du Congo' },
  { code: 'UG', name: 'Ouganda' },
  { code: 'TZ', name: 'Tanzanie' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'ZM', name: 'Zambie' },
  { code: 'ZW', name: 'Zimbabwe' },
  { code: 'BW', name: 'Botswana' },
  { code: 'NA', name: 'Namibie' },
  { code: 'AO', name: 'Angola' },
  { code: 'RU', name: 'Russie' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'BY', name: 'Biélorussie' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'UZ', name: 'Ouzbékistan' },
  { code: 'TJ', name: 'Tadjikistan' },
  { code: 'KG', name: 'Kirghizistan' },
  { code: 'TM', name: 'Turkménistan' },
  { code: 'AF', name: 'Afghanistan' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'NP', name: 'Népal' },
  { code: 'BT', name: 'Bhoutan' },
  { code: 'MM', name: 'Birmanie' },
  { code: 'LA', name: 'Laos' },
  { code: 'KH', name: 'Cambodge' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'TW', name: 'Taïwan' },
  { code: 'MO', name: 'Macao' },
  { code: 'CU', name: 'Cuba' },
  { code: 'DO', name: 'République Dominicaine' },
  { code: 'JM', name: 'Jamaïque' },
  { code: 'TT', name: 'Trinité-et-Tobago' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BB', name: 'Barbade' },
  { code: 'BZ', name: 'Belize' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'PA', name: 'Panama' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HN', name: 'Honduras' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'EC', name: 'Équateur' },
  { code: 'BO', name: 'Bolivie' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'GY', name: 'Guyana' },
  { code: 'SR', name: 'Suriname' },
  { code: 'FG', name: 'Guyane française' },
  { code: 'IS', name: 'Islande' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MT', name: 'Malte' },
  { code: 'CY', name: 'Chypre' },
  { code: 'HR', name: 'Croatie' },
  { code: 'SI', name: 'Slovénie' },
  { code: 'SK', name: 'Slovaquie' },
  { code: 'LT', name: 'Lituanie' },
  { code: 'LV', name: 'Lettonie' },
  { code: 'EE', name: 'Estonie' },
  { code: 'MD', name: 'Moldavie' },
  { code: 'RS', name: 'Serbie' },
  { code: 'BA', name: 'Bosnie-Herzégovine' },
  { code: 'ME', name: 'Monténégro' },
  { code: 'MK', name: 'Macédoine du Nord' },
  { code: 'AL', name: 'Albanie' },
  { code: 'BG', name: 'Bulgarie' },
  { code: 'GE', name: 'Géorgie' },
  { code: 'AM', name: 'Arménie' },
  { code: 'AZ', name: 'Azerbaïdjan' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Irak' },
  { code: 'SY', name: 'Syrie' },
  { code: 'LB', name: 'Liban' },
  { code: 'JO', name: 'Jordanie' },
  { code: 'PS', name: 'Palestine' },
  { code: 'OM', name: 'Oman' },
  { code: 'QA', name: 'Qatar' },
  { code: 'BH', name: 'Bahreïn' },
  { code: 'KW', name: 'Koweït' },
  { code: 'YE', name: 'Yémen' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MU', name: 'Maurice' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'DZ', name: 'Algérie' },
  { code: 'MA', name: 'Maroc' },
  { code: 'TN', name: 'Tunisie' },
  { code: 'LY', name: 'Libye' },
  { code: 'SD', name: 'Soudan' },
  { code: 'SS', name: 'Soudan du Sud' },
  { code: 'ET', name: 'Éthiopie' },
  { code: 'ER', name: 'Érythrée' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'SO', name: 'Somalie' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'BI', name: 'Burundi' },
  { code: 'MW', name: 'Malawi' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'SZ', name: 'Eswatini' },
];

const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name));

const categories = [
  { value: 'Salarié', label: 'Salarié' },
  { value: 'Fonctionnaire', label: 'Fonctionnaire' },
  { value: 'Profession Libérale', label: 'Profession Libérale' },
  { value: 'Commerçant', label: 'Commerçant / Entrepreneur' },
  { value: 'Retraité', label: 'Retraité' },
  { value: 'Autre', label: 'Autre' },
];

const countryCodeToName: Record<string, string> = countries.reduce((acc, country) => {
  acc[country.code] = country.name;
  return acc;
}, {} as Record<string, string>);

export default function LeadForm() {
  const [formData, setFormData] = useState({
    civilite: 'Mme',
    prenom: '',
    nom: '',
    categorie: '',
    pays: 'SN',
    ville: '',
    telephone: '',
    email: '',
    montant_cfa: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'payment_pending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const MIN_PEE_INVESTMENT_CFA = 30000;
const PEE_INVESTMENT_INCREMENT_CFA = 5000;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    setFormData(prev => ({ ...prev, montant_cfa: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const amount = parseInt(formData.montant_cfa.replace(/\s/g, ''), 10);
    const validIncrement = (amount - MIN_PEE_INVESTMENT_CFA) % PEE_INVESTMENT_INCREMENT_CFA === 0;
    return (
      formData.civilite &&
      formData.prenom &&
      formData.nom &&
      formData.categorie &&
      formData.pays &&
      formData.ville &&
      formData.telephone &&
      !isNaN(amount) &&
      amount >= MIN_PEE_INVESTMENT_CFA &&
      validIncrement
    );
  };

  const loadPaymentScripts = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if ((window as any).sendPaymentInfos) {
      setScriptsLoaded(true);
      return;
    }

    const loadCryptoJS = () => new Promise<void>((resolve, reject) => {
      if ((window as any).CryptoJS) { resolve(); return; }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load CryptoJS'));
      document.head.appendChild(script);
    });

    const loadIntouch = () => new Promise<void>((resolve, reject) => {
      if ((window as any).sendPaymentInfos) { resolve(); return; }
      const script = document.createElement('script');
      script.src = 'https://touchpay.gutouch.net/touchpayv2/script/touchpaynr/prod_touchpay-0.0.1.js';
      script.onload = () => setTimeout(() => {
        if ((window as any).sendPaymentInfos) resolve();
        else reject(new Error('sendPaymentInfos not available'));
      }, 500);
      script.onerror = () => reject(new Error('Failed to load Intouch script'));
      document.head.appendChild(script);
    });

    try {
      await loadCryptoJS();
      await loadIntouch();
      setScriptsLoaded(true);
      console.log('[PEE] Payment scripts loaded successfully');
    } catch (err) {
      console.error('[PEE] Error loading payment scripts:', err);
      setScriptsLoaded(false);
    }
  }, []);

  const triggerIntouchPayment = (referenceNumber: string, amount: number) => {
    if (typeof window === 'undefined' || typeof (window as any).sendPaymentInfos !== 'function') {
      setErrorMessage('Le système de paiement n\'est pas disponible. Veuillez rafraîchir la page.');
      setStatus('error');
      return;
    }

    const baseUrl = window.location.origin;
    const statusUrl = `${baseUrl}/pee/payment-status?referenceNumber=${referenceNumber}&amount=${amount}&source=intouch`;

    fetch('/api/payments/intouch/config')
      .then(res => res.json())
      .then(config => {
        if (config.error) {
          setErrorMessage(config.error);
          setStatus('error');
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
            'Dakar',
            formData.email,
            formData.prenom,
            formData.nom,
            formData.telephone
          );
        } else {
          setErrorMessage('Configuration de paiement manquante.');
          setStatus('error');
        }
      })
      .catch(() => {
        setErrorMessage('Erreur lors de l\'initialisation du paiement.');
        setStatus('error');
      });
  };

  // Load payment scripts when component mounts
  useEffect(() => {
    loadPaymentScripts();
  }, [loadPaymentScripts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/pee/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pays: countryCodeToName[formData.pays]
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('payment_pending');
        
        await fetch('/api/pee/subscribe', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referenceNumber: data.subscription.referenceNumber,
            status: 'PAYMENT_INITIATED',
          }),
        });

        // Ensure scripts are loaded before triggering payment
        if (!scriptsLoaded) {
          await loadPaymentScripts();
        }
        
        // Small delay to ensure scripts are ready
        setTimeout(() => {
          triggerIntouchPayment(data.subscription.referenceNumber, data.subscription.amount);
        }, 100);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Une erreur est survenue.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Une erreur de connexion est survenue.');
    }
  };

  if (status === 'success') {
    return (
      <section id="contact" className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 text-center shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-bold text-green-700 mb-3 sm:mb-4">Merci !</h3>
            <p className="text-base sm:text-lg text-green-800 mb-6">
              Votre demande a bien été reçue. Un conseiller Everest Finance vous contactera très prochainement.
            </p>
            <button 
              onClick={() => {
                setStatus('idle');
                setFormData({
                  civilite: 'Mme',
                  prenom: '',
                  nom: '',
                  categorie: '',
                  pays: 'SN',
                  ville: '',
                  telephone: '',
                  email: '',
                  montant_cfa: ''
                });
              }}
              className="bg-[#C09037] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-[#b3830f] transition-all duration-300 hover:shadow-lg"
            >
              Envoyer une autre demande
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-16 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
            <span className="text-[#C09037]">Épargne sécurisée et rentable,</span>{' '}
            <span className="text-[#2e0e36]">simplifiez-vous</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-[#2e0e36]/70">
            Souscrivez à Educ'épargne dès {MIN_PEE_INVESTMENT_CFA.toLocaleString('fr-FR')} FCFA et bénéficiez d'un rendement attractif.
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 border border-gray-300">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            
            {/* Civilité - Top Left */}
            <div className="max-w-xs">
              <label className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-2">Civilité *</label>
              <div className="flex space-x-4 sm:space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="civilite"
                    value="Mr"
                    checked={formData.civilite === 'Mr'}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#C09037] focus:ring-[#C09037] cursor-pointer"
                  />
                  <span className="ml-2 text-sm sm:text-base text-[#2e0e36]">Mr</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="civilite"
                    value="Mme"
                    checked={formData.civilite === 'Mme'}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#C09037] focus:ring-[#C09037] cursor-pointer"
                  />
                  <span className="ml-2 text-sm sm:text-base text-[#2e0e36]">Mme</span>
                </label>
              </div>
            </div>

            {/* Prénom, Nom - Same Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="prenom" className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-1.5 sm:mb-2">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  id="prenom"
                  required
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C09037] focus:border-[#C09037] transition-all duration-200 text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="nom" className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-1.5 sm:mb-2">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  id="nom"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C09037] focus:border-[#C09037] transition-all duration-200 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Catégorie - Full Row */}
            <div>
              <label htmlFor="categorie" className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-1.5 sm:mb-2">Catégorie socio-professionnelle *</label>
              <Select
                value={formData.categorie}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, categorie: value }))}
              >
                <SelectTrigger className="h-auto w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 bg-white text-sm sm:text-base focus:ring-2 focus:ring-[#C09037] focus:ring-offset-0">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pays de résidence, Ville - Same Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="pays" className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-1.5 sm:mb-2">Pays de résidence *</label>
                <Select
                  value={formData.pays}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, pays: value }))}
                >
                  <SelectTrigger className="h-auto w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 bg-white text-sm sm:text-base focus:ring-2 focus:ring-[#C09037] focus:ring-offset-0">
                    <span className="flex items-center gap-2">
                      <ReactCountryFlag countryCode={formData.pays} svg style={{ width: '1.5em', height: '1.5em' }} />
                      <span>{countryCodeToName[formData.pays] ?? 'Sélectionner...'}</span>
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {sortedCountries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="flex items-center gap-2">
                          <ReactCountryFlag countryCode={country.code} svg style={{ width: '1.5em', height: '1.5em' }} />
                          <span>{country.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="ville" className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-1.5 sm:mb-2">Ville *</label>
                <input
                  type="text"
                  name="ville"
                  id="ville"
                  required
                  value={formData.ville}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C09037] focus:border-[#C09037] transition-all duration-200 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Téléphone, Email - Same Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="telephone" className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-1.5 sm:mb-2">Numéro de téléphone *</label>
                <input
                  type="tel"
                  name="telephone"
                  id="telephone"
                  required
                  placeholder="+221..."
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C09037] focus:border-[#C09037] transition-all duration-200 text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-1.5 sm:mb-2">Adresse email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C09037] focus:border-[#C09037] transition-all duration-200 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Montant */}
            <div>
              <label htmlFor="montant_cfa" className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-1.5 sm:mb-2">
                Montant en FCFA * (minimum {MIN_PEE_INVESTMENT_CFA.toLocaleString('fr-FR')} FCFA)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const current = parseInt(formData.montant_cfa.replace(/\s/g, ''), 10) || MIN_PEE_INVESTMENT_CFA;
                    const newVal = Math.max(MIN_PEE_INVESTMENT_CFA, current - PEE_INVESTMENT_INCREMENT_CFA);
                    setFormData(prev => ({ ...prev, montant_cfa: newVal.toString() }));
                  }}
                  className="flex-shrink-0 w-12 h-12 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-xl font-bold text-[#2e0e36] transition-colors"
                >
                  −
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    name="montant_cfa"
                    id="montant_cfa"
                    required
                    inputMode="numeric"
                    placeholder={MIN_PEE_INVESTMENT_CFA.toLocaleString('fr-FR')}
                    value={formData.montant_cfa ? parseInt(formData.montant_cfa.replace(/\s/g, ''), 10).toLocaleString('fr-FR') : ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      setFormData(prev => ({ ...prev, montant_cfa: raw }));
                    }}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C09037] focus:border-[#C09037] transition-all duration-200 text-sm sm:text-base text-center font-semibold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">FCFA</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current = parseInt(formData.montant_cfa.replace(/\s/g, ''), 10) || (MIN_PEE_INVESTMENT_CFA - PEE_INVESTMENT_INCREMENT_CFA);
                    const newVal = current + PEE_INVESTMENT_INCREMENT_CFA;
                    setFormData(prev => ({ ...prev, montant_cfa: newVal.toString() }));
                  }}
                  className="flex-shrink-0 w-12 h-12 rounded-lg border border-gray-300 bg-[#C09037] hover:bg-[#b3830f] text-xl font-bold text-white transition-colors"
                >
                  +
                </button>
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Incréments de {PEE_INVESTMENT_INCREMENT_CFA.toLocaleString('fr-FR')} FCFA
              </p>
            </div>

            {/* Payment pending */}
            {status === 'payment_pending' && (
              <div className="p-4 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                <div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Redirection vers le portail de paiement Intouch...
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 sm:pt-6">
              <button
                type="submit"
                disabled={!isFormValid() || status === 'submitting' || status === 'payment_pending' || !scriptsLoaded}
                className={`inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base text-white shadow-md transition-all duration-300 ${
                  !isFormValid() || status === 'submitting' || status === 'payment_pending' || !scriptsLoaded
                    ? 'bg-[#C09037]/50 cursor-not-allowed'
                    : 'bg-[#b3830f] hover:shadow-lg hover:scale-[1.02]'
                }`}
              >
                {!scriptsLoaded ? 'Chargement du paiement...' : status === 'payment_pending' ? 'Redirection...' : status === 'submitting' ? 'Traitement...' : 'Procéder au paiement →'}
              </button>
              {!scriptsLoaded && (
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Initialisation du système de paiement...
                </p>
              )}
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center text-sm sm:text-base">
                {errorMessage}
              </div>
            )}
            
            <p className="text-center text-xs sm:text-sm text-[#2e0e36]/60 mt-3 sm:mt-4">
              Les champs marqués d'un astérisque (*) sont obligatoires.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
