'use client';

import { useState } from 'react';
import { SAMA_NAFFA_CONTACT } from '@/lib/contact';
import { 
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'decouvrir' | 'utilisation' | 'glossaire';
}

interface GlossaryItem {
  term: string;
  definition: string;
}

const faqData: FAQItem[] = [
  // DÉCOUVRIR SAMA NAFFA
  {
    id: 1,
    question: "Qu'est-ce que Sama Naffa?",
    answer: "SAMA NAFFA est un service de gestion sous mandat proposé par EVEREST Finance (SGI). Nous plaçons et gérons votre épargne en obligations de l'État, pour votre compte, avec un objectif de rendement. Le rendement n'est pas garanti et la valeur peut varier.",
    category: 'decouvrir'
  },
  {
    id: 2,
    question: "Pourquoi choisir Sama Naffa?",
    answer: "Parce qu'avec Sama Naffa, votre argent ne dort pas: il fructifie, il finance l'économie locale et il vous rapproche de vos projets de vie. C'est une épargne moderne, inclusive et tournée vers l'avenir.",
    category: 'decouvrir'
  },
  {
    id: 3,
    question: "Qu'est-ce qu'un Naffa?",
    answer: "Un Naffa, c'est votre épargne gérée pour un objectif — un compte-titres individuel ouvert à votre nom. Ce n'est pas un porte-monnaie de paiement. Le mot Naffa vient du wolof et désigne la pochette traditionnelle où l'on gardait ses économies.",
    category: 'decouvrir'
  },
  {
    id: 4,
    question: "Combien de Naffa peut-on créer?",
    answer: "Il n'y a pas de limites au nombre de Naffa que vous pouvez créer. Chaque Naffa est distinct et peut être dédié à un projet ou un objectif spécifique.",
    category: 'decouvrir'
  },
  {
    id: 5,
    question: "Quel est le montant minimum d'épargne avec Sama Naffa?",
    answer: "Le montant minimum d'épargne est fixé à 1 000 FCFA. Ce seuil volontairement accessible permet à chacun de commencer à constituer une épargne gérée, avec un objectif de rendement non garanti.",
    category: 'decouvrir'
  },
  {
    id: 6,
    question: "À quelle fréquence puis-je épargner?",
    answer: "Chaque épargnant choisit librement quand et combien alimenter son Naffa, selon ses possibilités et ses objectifs. Il n'y a pas de fréquence imposée.",
    category: 'decouvrir'
  },
  {
    id: 7,
    question: "Quelle est la durée minimale de placement avec Sama Naffa?",
    answer: "La durée minimale de placement est fixée à un (1) an. À la fin de votre horizon, vous pouvez demander la mise à disposition de votre épargne ou reconduire votre Naffa. L'objectif de rendement communiqué n'est pas garanti.",
    category: 'decouvrir'
  },
  {
    id: 8,
    question: "Comment retirer mon argent?",
    answer: "Les conditions de retrait (rachat) dépendent de votre formule et de la convention de gestion. Depuis votre espace client, vous pouvez formuler une demande de retrait pour le Naffa concerné. Le délai et les modalités vous sont communiqués avant validation.",
    category: 'decouvrir'
  },
  {
    id: 9,
    question: "Quelle est la particularité de Sama Naffa?",
    answer: "Sama Naffa n'est pas un compte d'épargne bancaire : c'est une gestion sous mandat. Votre épargne est investie en obligations de l'État et gérée pour votre compte par Everest Finance (SGI).",
    category: 'decouvrir'
  },
  {
    id: 10,
    question: "Combien peut me rapporter Sama Naffa?",
    answer: "Sama Naffa vise un objectif de rendement sur votre épargne placée en obligations de l'État. Ce rendement n'est pas garanti : la valeur de votre portefeuille peut varier. Utilisez notre simulateur pour estimer un scénario indicatif.",
    category: 'decouvrir'
  },
  {
    id: 11,
    question: "Comment ma performance est-elle calculée?",
    answer: "La performance reflète l'évolution de la valeur de votre portefeuille géré (rendement du portefeuille), en fonction des titres détenus et de la durée de placement. Il ne s'agit pas d'intérêts de dépôt bancaire.",
    category: 'decouvrir'
  },
  {
    id: 12,
    question: "Peut-on consulter l'évolution de son investissement?",
    answer: "Oui. Depuis votre espace client, vous pouvez suivre à tout moment l'évolution de vos placements : versements, performance et valeur de votre Naffa.",
    category: 'decouvrir'
  },
  {
    id: 13,
    question: "Comment retirer mon investissement en fin d'horizon?",
    answer: "Le retrait de votre investissement se fait directement depuis votre espace client : 1. Rendez-vous dans le menu « Demande de retrait ». 2. Sélectionnez le Naffa concerné et indiquez le montant à retirer. 3. Confirmez la demande et choisissez le mode de retrait disponible (ex. via un partenaire comme Wave ou un point de retrait agréé). 4. Votre demande est traitée dans les délais indiqués dans votre convention de gestion.",
    category: 'decouvrir'
  },
  {
    id: 14,
    question: "Mon argent est-il en sécurité?",
    answer: "Vos fonds sont cantonnés sur un compte dédié, séparé de celui d'Everest Finance, et inscrits sur un compte-titres à votre nom. Everest Finance est une SGI agréée et régulée par le CREPMF. Aucun placement financier n'est sans risque.",
    category: 'decouvrir'
  },
  {
    id: 15,
    question: "Mes informations personnelles sont-elles protégées?",
    answer: "Oui. La protection de vos données personnelles est une priorité. Elles sont sécurisées par des technologies conformes et traitées en toute confidentialité, conformément à la réglementation en vigueur.",
    category: 'decouvrir'
  },
  {
    id: 16,
    question: "Endossement EVEREST",
    answer: "SAMA NAFFA est développé par EVEREST Finance, Société de Gestion et d'Intermédiation (SGI) agréée et régulée par le CREPMF (Autorité des Marchés Financiers de l'UMOA).",
    category: 'decouvrir'
  },

  // UTILISATION ET SERVICE CLIENT
  {
    id: 17,
    question: "Comment épargner avec Sama Naffa?",
    answer: "Pour épargner avec Sama Naffa, il suffit de vous inscrire sur notre plateforme et de créer votre premier Naffa selon votre objectif. L'ouverture d'un compte Sama Naffa se fait entièrement en ligne: il vous suffit d'accéder à la plateforme, de renseigner vos informations personnelles et de valider votre identité (KYC). Une fois votre profil vérifié, vous choisissez le montant et la durée. Vos versements sont ensuite investis automatiquement sur le marché financier régional.",
    category: 'utilisation'
  },
  {
    id: 18,
    question: "Quelles sont les méthodes de paiement acceptées?",
    answer: "Tous les paiements passent par MY TOUCH POINT, qui permet d'utiliser: Le Mobile Money (Orange Money, Wave, Free Money, etc.), Les cartes bancaires.",
    category: 'utilisation'
  },
  {
    id: 19,
    question: "Comment alimenter mon Naffa depuis l'étranger?",
    answer: "Grâce à notre partenariat avec Intouch, vous pouvez alimenter votre Naffa depuis l'étranger via Mobile Money ou carte bancaire. Les fonds sont crédités sur votre Naffa après confirmation du paiement.",
    category: 'utilisation'
  },
  {
    id: 20,
    question: "Comment alimenter mon Naffa?",
    answer: "Grâce à notre partenariat avec Intouch, vous pouvez alimenter votre Naffa via Mobile Money (Orange Money, Wave, Free Money, etc.) ou carte bancaire. Les fonds sont investis en obligations de l'État selon votre mandat de gestion.",
    category: 'utilisation'
  },
  {
    id: 21,
    question: "Peut-on connecter son Naffa à plusieurs appareils?",
    answer: "Oui. Votre Naffa s'adapte automatiquement à tous les écrans (téléphone, tablette, ordinateur), avec une authentification sécurisée. Toutefois, il est conseillé de se déconnecter systématiquement après consultation de son Naffa",
    category: 'utilisation'
  },
  {
    id: 22,
    question: "Comment contacter le service client?",
    answer: `Téléphone : ${SAMA_NAFFA_CONTACT.phone}, E-mail : ${SAMA_NAFFA_CONTACT.email}, via votre espace client.`,
    category: 'utilisation'
  },
  {
    id: 23,
    question: "Quels sont les frais liés à l'utilisation de Sama Naffa ?",
    answer: "L'ouverture d'un compte Sama Naffa est gratuite. Des frais de gestion (0,45 % trimestriel) et de valorisation (0,25 % trimestriel) s'appliquent selon la grille tarifaire homologuée AMF-UMOA. Le détail figure dans nos conditions générales d'utilisation (page CGU).",
    category: 'utilisation'
  },
];

const glossaryData: GlossaryItem[] = [
  {
    term: "AMF-UMOA",
    definition: "Autorité des Marchés Financiers de l'Union Monétaire Ouest Africaine"
  },
  {
    term: "CREPMF",
    definition: "Conseil Régional de l'Épargne Publique et des Marchés Financiers — autorité de régulation des SGI et des marchés financiers de l'UMOA."
  },
  {
    term: "Capitalisation",
    definition: "Mécanisme par lequel les gains générés s'ajoutent au capital investi pour produire à leur tour un rendement sur la période suivante."
  },
  {
    term: "Échéance",
    definition: "Date à laquelle un Naffa arrive à son terme. L'épargnant peut alors retirer ses fonds ou reconduire son Naffa."
  },
  {
    term: "Gestion sous mandat",
    definition: "Prestation par laquelle une SGI investit et gère l'épargne d'un client pour son compte, selon une convention signée. Obligation de moyens — le rendement n'est pas garanti."
  },
  {
    term: "Intouch",
    definition: "Plateforme partenaire par laquelle passent les versements et retraits sur Sama Naffa (Mobile Money, cartes bancaires)."
  },
  {
    term: "Marché financier régional (UMOA)",
    definition: "Espace commun aux huit pays de l'UEMOA où s'échangent les capitaux. Il permet aux États et entreprises de se financer et aux investisseurs de placer leur épargne."
  },
  {
    term: "Naffa",
    definition: "Compte géré individuel ouvert sur Sama Naffa pour un objectif d'épargne. Ce n'est pas un porte-monnaie de paiement."
  },
  {
    term: "Obligation",
    definition: "Titre de créance émis par un État ou une entreprise. Sama Naffa investit principalement en obligations de l'État (titres souverains UEMOA)."
  },
  {
    term: "OTP (One-Time Password)",
    definition: "Code de sécurité à usage unique envoyé par SMS ou e-mail, utilisé pour valider certaines opérations sensibles (connexion, versement, retrait)."
  },
  {
    term: "Placement",
    definition: "Montant d'argent épargné dans un Naffa et investi sur le marché financier par Sama Naffa pour générer un rendement."
  },
  {
    term: "Rendement",
    definition: "Gain généré par un placement, exprimé en pourcentage du montant épargné."
  },
  {
    term: "UMOA",
    definition: "Union Monétaire Ouest-Africaine, zone regroupant huit pays d'Afrique de l'Ouest utilisant le franc CFA (XOF) et partageant un marché financier commun."
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
    { id: 'decouvrir', name: 'Découvrir Sama Naffa', icon: QuestionMarkCircleIcon },
    { id: 'utilisation', name: 'Utilisation', icon: DevicePhoneMobileIcon },
    { id: 'glossaire', name: 'Glossaire', icon: BanknotesIcon }
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

        {/* FAQ Items or Glossary */}
        {activeCategory === 'glossaire' ? (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-timberwolf/20 shadow-sm p-6">
              <h2 className="text-2xl font-bold text-night mb-6">Glossaire</h2>
              <div className="grid gap-4">
                {glossaryData.map((item, index) => (
                  <div key={index} className="border-b border-timberwolf/10 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-night mb-2">{item.term}</h3>
                    <p className="text-night/70 leading-relaxed">{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
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
        )}

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

