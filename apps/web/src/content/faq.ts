export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'savings' | 'ape' | 'technical' | 'security';
}

export const faqItems: FAQItem[] = [
  // General Questions
  {
    id: 'what-is-sama-naffa',
    question: 'Qu\'est-ce que Sama Naffa ?',
    answer: 'Sama Naffa est une plateforme d\'épargne digitale mobile-first qui permet aux Sénégalais d\'épargner facilement et en toute sécurité. Nous proposons des programmes d\'épargne personnalisés et des investissements APE avec confirmation immédiate et conformité BCEAO.',
    category: 'general'
  },
  {
    id: 'how-to-start',
    question: 'Comment commencer à épargner avec Sama Naffa ?',
    answer: 'C\'est très simple ! Choisissez votre profil d\'épargne, remplissez le formulaire KYC, effectuez votre premier versement via mobile money, et c\'est tout ! Votre compte est ouvert en quelques minutes avec confirmation immédiate.',
    category: 'general'
  },
  {
    id: 'minimum-amount',
    question: 'Quel est le montant minimum pour commencer ?',
    answer: 'Le montant minimum varie selon le profil choisi. Pour l\'épargne personnalisée, vous pouvez commencer avec 10 000 FCFA par mois. Pour l\'APE, le minimum est de 50 000 FCFA.',
    category: 'general'
  },

  // Savings Questions
  {
    id: 'savings-security',
    question: 'Mes fonds d\'épargne sont-ils sécurisés ?',
    answer: 'Absolument ! Nous sommes conformes aux normes BCEAO et travaillons avec des partenaires bancaires de confiance. Vos fonds sont garantis et protégés par les mêmes standards de sécurité que les banques traditionnelles.',
    category: 'savings'
  },
  {
    id: 'interest-rates',
    question: 'Comment sont calculés les taux d\'intérêt ?',
    answer: 'Nos taux d\'intérêt sont basés sur les taux BCEAO et varient selon la durée de votre épargne. Plus la durée est longue, plus le taux est attractif. Les taux vont de 3% pour les épargnes courtes à 7% pour les épargnes longues.',
    category: 'savings'
  },
  {
    id: 'withdrawals',
    question: 'Comment effectuer des retraits ?',
    answer: 'Les retraits peuvent être effectués selon les conditions de votre profil. Ils sont traités instantanément via mobile money ou virement bancaire. Vous recevez une confirmation immédiate par WhatsApp.',
    category: 'savings'
  },
  {
    id: 'monthly-payments',
    question: 'Puis-je modifier mon versement mensuel ?',
    answer: 'Oui, vous pouvez ajuster votre versement mensuel dans les limites de votre profil. Les modifications sont effectives le mois suivant et vous recevez une notification de confirmation.',
    category: 'savings'
  },

  // APE Questions
  {
    id: 'what-is-ape',
    question: 'Qu\'est-ce que l\'Actionnariat Populaire Economique (APE) ?',
    answer: 'L\'APE est un programme d\'investissement citoyen lancé par l\'État du Sénégal. Il permet aux citoyens d\'investir dans le développement national tout en bénéficiant d\'un rendement garanti de 7.5% annuel.',
    category: 'ape'
  },
  {
    id: 'ape-guarantee',
    question: 'L\'APE est-il garanti par l\'État ?',
    answer: 'Oui, l\'APE bénéficie de la garantie totale de l\'État sénégalais. Votre investissement est 100% sécurisé et le rendement de 7.5% annuel est garanti pour toute la durée de votre investissement.',
    category: 'ape'
  },
  {
    id: 'ape-duration',
    question: 'Quelle est la durée minimum pour l\'APE ?',
    answer: 'La durée minimum pour l\'APE est de 5 ans. Vous pouvez choisir des durées de 5, 7 ou 10 ans selon vos objectifs d\'investissement.',
    category: 'ape'
  },
  {
    id: 'ape-returns',
    question: 'Quand recevrai-je mes intérêts APE ?',
    answer: 'Vous pouvez choisir entre deux modes : réinvestissement automatique des intérêts (intérêts composés) ou paiement annuel des intérêts sur votre compte mobile money.',
    category: 'ape'
  },

  // Technical Questions
  {
    id: 'mobile-app',
    question: 'Y a-t-il une application mobile ?',
    answer: 'Notre plateforme est entièrement mobile-first et optimisée pour les navigateurs mobiles. Une application native sera bientôt disponible sur iOS et Android.',
    category: 'technical'
  },
  {
    id: 'browser-support',
    question: 'Quels navigateurs sont supportés ?',
    answer: 'Notre plateforme fonctionne sur tous les navigateurs modernes : Chrome, Safari, Firefox, Edge. Nous recommandons d\'utiliser la version la plus récente pour une expérience optimale.',
    category: 'technical'
  },
  {
    id: 'kyc-documents',
    question: 'Quels documents sont requis pour le KYC ?',
    answer: 'Pour l\'épargne : pièce d\'identité et selfie. Pour l\'APE : pièce d\'identité, justificatif de domicile et selfie. Tous les documents sont vérifiés automatiquement par notre système.',
    category: 'technical'
  },

  // Security Questions
  {
    id: 'data-protection',
    question: 'Mes données personnelles sont-elles protégées ?',
    answer: 'Oui, nous respectons strictement la réglementation sur la protection des données. Vos informations sont chiffrées et stockées de manière sécurisée. Nous ne partageons jamais vos données avec des tiers sans votre consentement.',
    category: 'security'
  },
  {
    id: 'account-security',
    question: 'Comment sécuriser mon compte ?',
    answer: 'Votre compte est protégé par authentification à deux facteurs et notifications de sécurité. Nous vous alertons immédiatement de toute activité suspecte par WhatsApp et email.',
    category: 'security'
  },
  {
    id: 'bcaeo-compliance',
    question: 'Sama Naffa est-il conforme à la BCEAO ?',
    answer: 'Oui, nous sommes entièrement conformes aux réglementations BCEAO. Notre licence nous permet d\'opérer légalement dans l\'espace UEMOA et nous respectons tous les standards de sécurité financière.',
    category: 'security'
  }
];

export const faqCategories = [
  { id: 'general', name: 'Général', icon: 'ℹ️' },
  { id: 'savings', name: 'Épargne', icon: '💰' },
  { id: 'ape', name: 'APE', icon: '📈' },
  { id: 'technical', name: 'Technique', icon: '🔧' },
  { id: 'security', name: 'Sécurité', icon: '🛡️' }
];

export function getFAQByCategory(category: string): FAQItem[] {
  return faqItems.filter(item => item.category === category);
}

export function searchFAQ(query: string): FAQItem[] {
  const lowercaseQuery = query.toLowerCase();
  return faqItems.filter(item => 
    item.question.toLowerCase().includes(lowercaseQuery) ||
    item.answer.toLowerCase().includes(lowercaseQuery)
  );
}
