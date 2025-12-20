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
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center shadow-lg">
            <h3 className="text-3xl font-bold text-green-700 mb-4">Merci !</h3>
            <p className="text-lg text-green-800 mb-6">
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
              className="bg-[#d4af37] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#b5952f] transition-colors"
            >
              Envoyer une autre demande
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-[#C38D1C]">Épargne sécurisée et rentable,</span>{' '}
            <span className="text-[#2e0e36]">simplifiez-vous</span>
          </h2>
          <p className="text-xl text-[#2e0e36]/70">
            Remplissez le formulaire de contact
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Civilité */}
            <div>
              <label className="block text-sm font-medium text-[#2e0e36] mb-2">Civilité *</label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="civilite"
                    value="Mr"
                    checked={formData.civilite === 'Mr'}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#C38D1C] focus:ring-[#C38D1C]"
                  />
                  <span className="ml-2 text-[#2e0e36]">Mr</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="civilite"
                    value="Mme"
                    checked={formData.civilite === 'Mme'}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#C38D1C] focus:ring-[#C38D1C]"
                  />
                  <span className="ml-2 text-[#2e0e36]">Mme</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prénom */}
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-[#2e0e36] mb-1">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  id="prenom"
                  required
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#C38D1C] focus:border-[#C38D1C] transition-colors"
                />
              </div>

              {/* Nom */}
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-[#2e0e36] mb-1">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  id="nom"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#C38D1C] focus:border-[#C38D1C] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Catégorie */}
              <div>
                <label htmlFor="categorie" className="block text-sm font-medium text-[#2e0e36] mb-1">Catégorie socio-professionnelle *</label>
                <select
                  name="categorie"
                  id="categorie"
                  required
                  value={formData.categorie}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#C38D1C] focus:border-[#C38D1C] bg-white"
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
                <label htmlFor="pays" className="block text-sm font-medium text-[#2e0e36] mb-1">Pays de résidence *</label>
                <select
                  name="pays"
                  id="pays"
                  required
                  value={formData.pays}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#C38D1C] focus:border-[#C38D1C] bg-white"
                >
                  <option value="Sénégal">Sénégal</option>
                  <option value="France">France</option>
                  <option value="États-Unis">États-Unis</option>
                  <option value="Canada">Canada</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Ville */}
               <div>
                <label htmlFor="ville" className="block text-sm font-medium text-[#2e0e36] mb-1">Ville *</label>
                <input
                  type="text"
                  name="ville"
                  id="ville"
                  required
                  value={formData.ville}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#C38D1C] focus:border-[#C38D1C] transition-colors"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-[#2e0e36] mb-1">Numéro de téléphone *</label>
                <input
                  type="tel"
                  name="telephone"
                  id="telephone"
                  required
                  placeholder="+221..."
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#C38D1C] focus:border-[#C38D1C] transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2e0e36] mb-1">Adresse email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#C38D1C] focus:border-[#C38D1C] transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid() || status === 'submitting'}
                className={`inline-flex items-center justify-center px-8 py-3 rounded-md font-bold text-base text-white shadow-md transition-colors ${
                  !isFormValid() || status === 'submitting'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#C38D1C] hover:opacity-90'
                }`}
              >
                {status === 'submitting' ? 'Envoi en cours...' : 'Envoyer →'}
              </button>
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center">
                {errorMessage}
              </div>
            )}
            
            <p className="text-center text-xs text-[#2e0e36]/60 mt-4">
              Les champs marqués d'un astérisque (*) sont obligatoires.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
