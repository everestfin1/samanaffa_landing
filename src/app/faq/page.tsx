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
  category: 'decouvrir' | 'utilisation' | 'ape' | 'glossaire';
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
    answer: "SAMA NAFFA est une plateforme d'épargne inclusive, proposée par EVEREST Finance, qui a pour ambition de rendre l'épargne accessible à tous. Elle permet à chaque particulier, quels que soient ses revenus ou sa situation, de placer son argent en toute sécurité et de bénéficier d'un rendement. En offrant une alternative moderne aux solutions classiques, Sama Naffa contribue à l'inclusion financière et donne à toutes les couches de la population la possibilité de bâtir leur avenir grâce à l'épargne rémunérée.",
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
    answer: "Un Naffa est une bourse digitale d'épargne (compte titre) dans laquelle vous déposez vos fonds pour les faire fructifier. Le mot Naffa vient du wolof et désigne une pochette traditionnelle que les anciens utilisaient pour garder leurs économies.",
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
    answer: "Le montant minimum d'épargne est fixé à 1 000 FCFA. Ce seuil volontairement accessible permet à chacun de commencer à constituer une épargne et de bénéficier d'un rendement, sans contrainte de revenu élevé.",
    category: 'decouvrir'
  },
  {
    id: 6,
    question: "Quelle est la fréquence des dépôts?",
    answer: "La fréquence des dépôts n'est pas fixe. Chaque épargnant choisit librement quand et combien déposer dans son Naffa, selon ses possibilités et ses objectifs.",
    category: 'decouvrir'
  },
  {
    id: 7,
    question: "Quelle est la durée minimale de placement avec Sama Naffa?",
    answer: "La durée minimale de placement est fixée à un (1) an. À l'échéance, le Naffa peut être renouvelé si l'épargnant souhaite prolonger son investissement et continuer à bénéficier d'un rendement.",
    category: 'decouvrir'
  },
  {
    id: 8,
    question: "Peut-on retirer son argent avant l'échéance?",
    answer: "Chez SAMA NAFFA, nous croyons que chaque projet mérite le temps de grandir. C'est pourquoi il n'est pas possible de retirer son argent avant l'échéance choisie. Cette discipline n'est pas une contrainte, c'est la clé qui transforme votre épargne en véritable réussite: vous sécurisez vos fonds, vous maximisez vos gains et vous atteignez vos objectifs sereinement.",
    category: 'decouvrir'
  },
  {
    id: 9,
    question: "Quelle est la particularité de Sama Naffa?",
    answer: "Sama Naffa n'est pas un simple compte d'épargne: c'est une application qui investit directement vos dépôts sur le marché financier régional. Vos fonds sont bloqués jusqu'à l'échéance choisie, ce qui discipline l'épargne et assure un rendement croissant dans le temps.",
    category: 'decouvrir'
  },
  {
    id: 10,
    question: "Quel est le rendement offert par Sama Naffa?",
    answer: "Avec Sama Naffa, vous épargnez librement et bénéficiez d'un rendement bien plus attractif qu'avec un compte d'épargne classique. Vos fonds sont investis sur le marché financier régional pour maximiser leur croissance. Plus, la durée est longue, plus vos gains augmentent en toute sécurité. Utilisez notre simulateur disponible sur la plateforme et estimez votre gain futur.",
    category: 'decouvrir'
  },
  {
    id: 11,
    question: "Quelle est la méthodologie de calcul des intérêts?",
    answer: "Les fonds sont placés de manière structurée et disciplinée, la capitalisation est continue et optimisée dans le temps et l'épargne bénéficie d'un mécanisme de croissance automatique et efficiente grâce au marché. Les intérêts sont calculés sur la base du montant épargné et de la durée du placement. À l'échéance, vous recevez donc votre capital initial augmenté des intérêts cumulés.",
    category: 'decouvrir'
  },
  {
    id: 12,
    question: "Peut-on consulter l'évolution de son investissement?",
    answer: "Oui. Depuis votre espace client, vous pouvez suivre à tout moment l'évolution de vos placements. Toutes les information essentielles (dépôts, rendement, échéances) sont accessibles en temps réel.",
    category: 'decouvrir'
  },
  {
    id: 13,
    question: "Comment retirer son investissement à l'échéance?",
    answer: "Le retrait de votre investissement se fait directement depuis votre espace client: 1. Rendez-vous dans le menu « Demande de retrait ». 2. Sélectionnez le Naffa concerné et indiquez le montant à retirer. 3. Confirmez la demande et choisissez le mode de retrait disponible (ex. via un partenaire comme Wave ou un point de retrait agréé). 4. Votre demande est traitée sous 24 heures maximum.",
    category: 'decouvrir'
  },
  {
    id: 14,
    question: "Mon argent est-il en sécurité avec Sama Naffa?",
    answer: "Oui. Les fonds déposés sont gérés dans un cadre réglementé. Chaque transaction est protégée par des systèmes de sécurité avancés, et vous disposez d'une traçabilité complète.",
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
    answer: "SAMA NAFFA est développé à EVEREST Finance, Société de Gestion et d'Intermédiation (SGI) agréée par l'Autorité des Marchés Financiers (AMF) de l'UMOA. Ceci garantit que toutes les opérations respectent le cadre réglementaire et bénéficient de l'expertise d'un acteur reconnu des marchés financiers.",
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
    question: "Comment effectuer un dépôt avec une carte bancaire depuis l'étranger?",
    answer: "Grace à notre partenariat avec Intouch, vous pouvez alimenter votre Naffa directement depuis l'étranger. Les dépôts se font en toute sécurité à partir de votre compte bancaire ou de vos solutions de paiement habituelles, et sont crédités rapidement sur votre Naffa. Ce dispositif simplifie les transferts de la diaspora et vous permet d'investir facilement sur le marché financier régional, où que vous soyez.",
    category: 'utilisation'
  },
  {
    id: 20,
    question: "Comment faire un dépôt sur son Naffa?",
    answer: "Grace à notre partenariat avec Intouch, vous pouvez alimenter votre Naffa. Les dépôts se font en toute sécurité à partir de votre compte bancaire ou de vos solutions de paiement habituelles, et sont crédités rapidement sur votre Naffa. Ce dispositif vous permet d'investir facilement sur le marché financier régional.",
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
    answer: "Téléphone: 77 XXX XX XX, E-mail : xxxxxx@xxxxx.com, Via votre espace client.",
    category: 'utilisation'
  },
  {
    id: 23,
    question: "Quels sont les frais liés à l'utilisation de Sama Naffa ?",
    answer: "Ouvrir un compte Sama Naffa est totalement gratuit et sans frais cachés. Chaque dépôt que vous effectuez est investi à 100 % sur le marché financier régional pour maximiser votre rendement. Nous appliquons uniquement de légers frais de gestion déjà intégrés dans le calcul du rendement affiché: vous savez donc exactement ce que vous gagnez, en toute transparence. Le détail complet de la tarification est disponible sur la page des Conditions d'utilisation.",
    category: 'utilisation'
  },

  // Emprunt Obligataire par Appel Public à L'Épargne (APE)
  {
    id: 24,
    question: "Comment souscrire à un Emprunt Obligataire ?",
    answer: "Pour souscrire à un emprunt obligataire, il vous suffit de : 1. Aller dans l'onglet « Emprunt Obligataire ». 2. Sélectionner la tranche à laquelle vous souhaitez souscrire. 3. Indiquer le montant de votre souscription. 4. Signer électroniquement votre engagement. 5. Effectuer le paiement. Une fois ces étapes validées, votre souscription est enregistrée et confirmée.",
    category: 'ape'
  },
  {
    id: 25,
    question: "Peut-on souscrire à plusieurs tranches avec le même profil?",
    answer: "Oui. Avec un même profil, vous pouvez souscrire à plusieurs tranches. La souscription se fait une tranche à la fois, en répétant la même démarche que pour la souscription initiale.",
    category: 'ape'
  }
];

const glossaryData: GlossaryItem[] = [
  {
    term: "AMF-UMOA",
    definition: "Autorité des Marchés Financiers de l'Union Monétaire Ouest Africaine"
  },
  {
    term: "Appel Public à l'Épargne",
    definition: "opération par laquelle une entreprise ou un État sollicite directement le grand public pour collecter des fonds, en émettant des titres (actions, obligations)."
  },
  {
    term: "BCEAO",
    definition: "Banque Centrale des États de l'Afrique de l'Ouest, qui encadre le système bancaire et monétaire de l'UMOA."
  },
  {
    term: "Capitalisation",
    definition: "Méthode de calcul des intérêts où les gains générés périodiquement s'ajoutent au capital initial pour produire à leur tour des intérêts la période suivante."
  },
  {
    term: "Échéance",
    definition: "Date à laquelle un Naffa arrive à son terme. L'épargnant peut alors retirer ses fonds ou reconduire son Naffa."
  },
  {
    term: "Emprunt Obligataire",
    definition: "opération par laquelle un État ou une entreprise emprunte de l'argent auprès du public en émettant des obligations, qu'il s'engage à rembourser avec intérêts."
  },
  {
    term: "Intouch",
    definition: "Plateforme partenaire sécurisée par laquelle passent tous les dépôts et retraits effectués sur Sama Naffa. Elle permet d'utiliser différents moyens de paiement comme le Mobile Money et les cartes bancaires."
  },
  {
    term: "Marché financier régional (UMOA)",
    definition: "Espace commun aux huit pays de l'UEMOA où s'échangent les capitaux. Il permet aux États et entreprises de se financer et aux investisseurs de placer leur épargne."
  },
  {
    term: "Naffa",
    definition: "Bourse digitale d'épargne créée sur Sama Naffa pour déposer et faire fructifier son argent. Le terme vient du wolof et désigne la petite pochette traditionnelle où les anciens gardaient leurs économies."
  },
  {
    term: "Obligation",
    definition: "Titre de créance représentatif d'un prêt. Celui qui achète une obligation prête de l'argent à l'émetteur (État ou entreprise), qui s'engage à le rembourser à une date fixée avec un intérêt."
  },
  {
    term: "OTP (One-Time Password)",
    definition: "Code de sécurité à usage unique envoyé par SMS ou e-mail, utilisé pour valider certaines opérations sensibles (connexion, dépôt, retrait)."
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
    { id: 'ape', name: 'Emprunt Obligataire', icon: BuildingLibraryIcon },
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

