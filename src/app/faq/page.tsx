'use client';

import { useState } from 'react';
import { 
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'sama-naffa' | 'ape' | 'security';
}

const faqData: FAQItem[] = [
  // General Questions
  {
    id: 1,
    question: "Qu'est-ce que Sama Naffa ?",
    answer: "Sama Naffa est une plateforme financière digitale qui offre des services bancaires et d'épargne innovants. Nous proposons des solutions d'épargne flexibles et des produits d'investissement pour vous aider à atteindre vos objectifs financiers.",
    category: 'general'
  },
  {
    id: 2,
    question: "Comment puis-je Ouvrir mon naffa ?",
    answer: "L'ouverture d'un compte est simple et rapide. Cliquez sur 'Commencer' dans la navigation, remplissez le formulaire d'inscription en quelques étapes, et votre compte sera activé immédiatement après vérification de vos informations.",
    category: 'general'
  },
  {
    id: 3,
    question: "Quels documents sont nécessaires pour l'inscription ?",
    answer: "Vous aurez besoin d'une pièce d'identité valide (CNI, passeport), d'un justificatif de domicile récent, et d'un numéro de téléphone mobile pour la vérification.",
    category: 'general'
  },

  // Sama Naffa Questions
  {
    id: 4,
    question: "Comment fonctionne l'épargne avec Sama Naffa ?",
    answer: "Sama Naffa propose plusieurs options d'épargne : épargne libre avec intérêts quotidiens, défis d'épargne (comme le défi 52 semaines), et épargne programmée pour vos objectifs spécifiques.",
    category: 'sama-naffa'
  },
  {
    id: 5,
    question: "Quel est le taux d'intérêt sur l'épargne ?",
    answer: "Nos taux d'épargne sont compétitifs et varient selon le type de produit. L'épargne libre offre jusqu'à 3% par an, tandis que les produits à terme peuvent offrir des taux plus élevés.",
    category: 'sama-naffa'
  },
  {
    id: 6,
    question: "Puis-je retirer mon argent à tout moment ?",
    answer: "Oui, avec l'épargne libre, vous pouvez retirer vos fonds à tout moment. Pour les produits à terme, des conditions spécifiques s'appliquent selon la durée d'engagement.",
    category: 'sama-naffa'
  },

  // APE Questions
  {
    id: 7,
    question: "Qu'est-ce que l'Emprunt Obligataire ?",
    answer: "L'APE (Agence de Promotion des Exportations) Sénégal propose des produits d'investissement et des obligations pour diversifier votre portefeuille et générer des rendements attractifs.",
    category: 'ape'
  },
  {
    id: 8,
    question: "Quel est le montant minimum pour investir dans les produits APE ?",
    answer: "Le montant minimum varie selon le produit. Les obligations démarrent généralement à partir de 100 000 FCFA, tandis que certains produits d'investissement peuvent avoir des seuils différents.",
    category: 'ape'
  },
  {
    id: 9,
    question: "Quels sont les risques associés aux investissements APE ?",
    answer: "Comme tout investissement, les produits APE comportent des risques. Cependant, ils sont régulés par la BCEAO et offrent différents niveaux de risque selon votre profil d'investisseur.",
    category: 'ape'
  },

  // Security Questions
  {
    id: 10,
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire, une authentification à deux facteurs, et nous sommes conformes aux réglementations BCEAO en matière de sécurité des données.",
    category: 'security'
  },
  {
    id: 11,
    question: "Comment protégez-vous mon argent ?",
    answer: "Vos fonds sont protégés par plusieurs niveaux de sécurité : ségrégation des comptes clients, partenariats avec des banques agréées, et couverture d'assurance selon les réglementations en vigueur.",
    category: 'security'
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQ = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  const categories = [
    { id: 'all', name: 'Toutes les questions', icon: QuestionMarkCircleIcon },
    { id: 'general', name: 'Général', icon: QuestionMarkCircleIcon },
    { id: 'sama-naffa', name: 'Sama Naffa', icon: DevicePhoneMobileIcon },
    { id: 'ape', name: 'Emprunt Obligataire', icon: BuildingLibraryIcon },
    { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon }
  ];

  return (
    <div className="min-h-screen bg-white-smoke">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-night mb-4">
            Questions Fréquemment Posées
          </h1>
          <p className="text-xl text-night/70 max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur nos services et produits financiers.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-gold-metallic text-white shadow-sm'
                    : 'bg-white text-night/70 hover:text-night hover:bg-gold-metallic/10 border border-timberwolf/30'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQ.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-timberwolf/20 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-timberwolf/5 transition-colors"
              >
                <span className="font-medium text-night pr-4">{item.question}</span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-night/50 transition-transform ${
                    openItems.includes(item.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openItems.includes(item.id) && (
                <div className="px-6 pb-4 text-night/70 leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-gold-metallic/10 to-timberwolf/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-night mb-4">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-night/70 mb-6">
            Notre équipe de support est là pour vous aider. Contactez-nous directement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+221123456789"
              className="inline-flex items-center justify-center space-x-2 bg-gold-metallic text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-metallic/90 transition-colors"
            >
              <BanknotesIcon className="w-5 h-5" />
              <span>Appelez-nous</span>
            </a>
            <a
              href="mailto:support@samanaffa.sn"
              className="inline-flex items-center justify-center space-x-2 bg-white text-night px-6 py-3 rounded-lg font-semibold border border-timberwolf/20 hover:bg-timberwolf/10 transition-colors"
            >
              <span>Écrivez-nous</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

