'use client';

import { useState } from 'react';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Téléphone',
      details: ['+221 33 822 87 00', ''],
      action: 'Appelez-nous'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: ['contact@everestfin.com'],
      action: 'Écrivez-nous'
    },
    {
      icon: MapPinIcon,
      title: 'Adresse',
      details: ['18 Boulevard de la République', 'Dakar, Sénégal BP: 11659-13000'],
      action: 'Visitez-nous'
    },
    {
      icon: ClockIcon,
      title: 'Horaires',
      details: ['Lun - Ven: 8h00 - 18h00', 'Sam: 9h00 - 13h00'],
      action: 'Nos horaires'
    }
  ];

  return (
    <div className="min-h-screen bg-white-smoke">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-night mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-night/70 max-w-2xl mx-auto">
            Notre équipe est là pour répondre à toutes vos questions et vous accompagner dans vos projets financiers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-night mb-8">
              Informations de contact
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6 mb-8">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-6 border border-timberwolf/20 shadow-sm">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gold-metallic/10 p-3 rounded-lg">
                        <IconComponent className="w-6 h-6 text-gold-metallic" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-night mb-2">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-night/70 text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-gold-metallic/10 to-timberwolf/10 rounded-xl p-6">
              <h3 className="font-semibold text-night mb-4 flex items-center">
                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                Besoin d'aide immédiate ?
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-gold-metallic text-white py-3 px-4 rounded-lg font-medium hover:bg-gold-metallic/90 transition-colors">
                  Chat en direct
                </button>
                <button className="w-full bg-white text-night py-3 px-4 rounded-lg font-medium border border-timberwolf/20 hover:bg-timberwolf/10 transition-colors">
                  Programmer un appel
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-night mb-8">
              Envoyez-nous un message
            </h2>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-timberwolf/20 shadow-sm">
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 text-sm">
                    Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-night mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-night mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-night mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors"
                    placeholder="+221 XX XXX XX XX"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-night mb-2">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors"
                  >
                    {formData.subject === '' && (
                      <option value="">Sélectionner un sujet</option>
                    )}
                    <option value="general">Question générale</option>
                    <option value="account">Ouverture de compte</option>
                    <option value="sama-naffa">Sama Naffa - Épargne</option>
                    <option value="ape">APE - Investissements</option>
                    <option value="technical">Support technique</option>
                    <option value="partnership">Partenariat</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-night mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors resize-none"
                  placeholder="Décrivez votre demande ou question..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isSubmitting
                    ? 'bg-timberwolf/50 text-night/50 cursor-not-allowed'
                    : 'bg-gold-metallic text-white hover:bg-gold-metallic/90'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-night/30 border-t-night rounded-full animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-5 h-5" />
                    <span>Envoyer le message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-night mb-8 text-center">
            Notre localisation
          </h2>
          <div className="bg-timberwolf/20 rounded-xl h-64 flex items-center justify-center">
            <div className="text-center text-night/50">
              <MapPinIcon className="w-12 h-12 mx-auto mb-4" />
              <p>Carte interactive à venir</p>
              <p className="text-sm">18 Boulevard de la République, Dakar, Sénégal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
