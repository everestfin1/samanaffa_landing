'use client';

import { useState } from 'react';

export default function LeadForm() {
  const [formData, setFormData] = useState({
    civilite: 'Mme',
    prenom: '',
    nom: '',
    categorie: '',
    pays: 'Sénégal',
    ville: '',
    telephone: '',
    email: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      formData.civilite &&
      formData.prenom &&
      formData.nom &&
      formData.categorie &&
      formData.pays &&
      formData.ville &&
      formData.telephone
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/lead-pee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        // Trigger GA4 event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'lead_submit_pee', {
            'event_category': 'lead',
            'event_label': 'PEE Subscription'
          });
        }
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
                  pays: 'Sénégal',
                  ville: '',
                  telephone: '',
                  email: ''
                });
              }}
              className="bg-[#C38D1C] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-[#b3830f] transition-all duration-300 hover:shadow-lg"
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
            <span className="text-[#C38D1C]">Épargne sécurisée et rentable,</span>{' '}
            <span className="text-[#2e0e36]">simplifiez-vous</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-[#2e0e36]/70">
            Remplissez le formulaire de contact
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 border border-gray-300">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            
            {/* Civilité */}
            <div>
              <label className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-2">Civilité *</label>
              <div className="flex space-x-4 sm:space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="civilite"
                    value="Mr"
                    checked={formData.civilite === 'Mr'}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#C38D1C] focus:ring-[#C38D1C] cursor-pointer"
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
                    className="h-4 w-4 text-[#C38D1C] focus:ring-[#C38D1C] cursor-pointer"
                  />
                  <span className="ml-2 text-sm sm:text-base text-[#2e0e36]">Mme</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Prénom */}
              <div>
                <label htmlFor="prenom" className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-1.5 sm:mb-2">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  id="prenom"
                  required
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C38D1C] focus:border-[#C38D1C] transition-all duration-200 text-sm sm:text-base"
                />
              </div>

              {/* Nom */}
              <div>
                <label htmlFor="nom" className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-1.5 sm:mb-2">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  id="nom"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C38D1C] focus:border-[#C38D1C] transition-all duration-200 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Catégorie */}
              <div>
                <label htmlFor="categorie" className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-1.5 sm:mb-2">Catégorie socio-professionnelle *</label>
                <select
                  name="categorie"
                  id="categorie"
                  required
                  value={formData.categorie}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C38D1C] focus:border-[#C38D1C] bg-white transition-all duration-200 text-sm sm:text-base"
                >
                  <option value="">Sélectionner...</option>
                  <option value="Salarié">Salarié</option>
                  <option value="Fonctionnaire">Fonctionnaire</option>
                  <option value="Profession Libérale">Profession Libérale</option>
                  <option value="Commerçant">Commerçant / Entrepreneur</option>
                  <option value="Retraité">Retraité</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              {/* Pays */}
              <div>
                <label htmlFor="pays" className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-1.5 sm:mb-2">Pays de résidence *</label>
                <select
                  name="pays"
                  id="pays"
                  required
                  value={formData.pays}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C38D1C] focus:border-[#C38D1C] bg-white transition-all duration-200 text-sm sm:text-base"
                >
                  <option value="Sénégal">Sénégal</option>
                  <option value="France">France</option>
                  <option value="États-Unis">États-Unis</option>
                  <option value="Canada">Canada</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
               {/* Ville */}
               <div>
                <label htmlFor="ville" className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-1.5 sm:mb-2">Ville *</label>
                <input
                  type="text"
                  name="ville"
                  id="ville"
                  required
                  value={formData.ville}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C38D1C] focus:border-[#C38D1C] transition-all duration-200 text-sm sm:text-base"
                />
              </div>

              {/* Téléphone */}
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
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C38D1C] focus:border-[#C38D1C] transition-all duration-200 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm sm:text-base font-medium text-[#2e0e36] mb-1.5 sm:mb-2">Adresse email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C38D1C] focus:border-[#C38D1C] transition-all duration-200 text-sm sm:text-base"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 sm:pt-6">
              <button
                type="submit"
                disabled={!isFormValid() || status === 'submitting'}
                className={`inline-flex items-center justify-center bg-[#C38D1C]/50 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base text-white shadow-md transition-all duration-300 ${
                  !isFormValid() || status === 'submitting'
                    ? 'bg-[#C38D1C]/50 cursor-not-allowed'
                    : 'bg-[#b3830f] hover:shadow-lg hover:scale-[1.02]'
                }`}
              >
                {status === 'submitting' ? 'Envoi en cours...' : 'Envoyer →'}
              </button>
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
