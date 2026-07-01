import type { LegalDocument } from './types';

/** Source: project_docs/Politique cookies (page d'information).docx */
export const COOKIE_POLICY: LegalDocument = {
  title: 'Politique relative aux cookies et autres traceurs',
  subtitle: 'Application et site Sama Naffa, EVEREST Finance SA',
  sections: [
    {
      type: 'heading',
      text: '1. Qu’est-ce qu’un cookie ou un traceur',
    },
    {
      type: 'paragraph',
      text: 'Un cookie est un petit fichier déposé sur votre appareil lorsque vous utilisez l’application ou le site. Il sert à faire fonctionner le service et à le sécuriser, et, avec votre accord, à mesurer l’audience ou à vous proposer des contenus adaptés. D’autres technologies de suivi, regroupées ici sous le terme de traceurs, peuvent poursuivre les mêmes finalités.',
    },
    {
      type: 'heading',
      text: '2. Les traceurs que nous utilisons',
    },
    {
      type: 'paragraph',
      text: 'Les traceurs ci-dessous sont regroupés en trois catégories selon leur finalité. Les durées de conservation sont précisées dans le bandeau de gestion des cookies.',
    },
    {
      type: 'table',
      headers: ['Traceur', 'Finalité', 'Consentement', 'Durée'],
      rows: [
        [
          'Cookie de session et d’authentification (EVEREST Finance)',
          'Connexion, maintien de la session et sécurité',
          'Non requis',
          'Session',
        ],
        [
          'Mémorisation de vos choix de cookies (EVEREST Finance)',
          'Conserver vos préférences de consentement',
          'Non requis',
          '12 mois',
        ],
        [
          'Google Tag Manager (Google)',
          'Déclenche les traceurs de mesure et de publicité',
          'Requis',
          'Selon traceur déclenché',
        ],
        [
          'Mesure d’audience, Google Analytics (Google)',
          'Statistiques de fréquentation et d’usage',
          'Requis',
          'Selon configuration Google',
        ],
        [
          'Meta Pixel (Meta Platforms)',
          'Mesure des campagnes et publicité ciblée',
          'Requis',
          'Selon configuration Meta',
        ],
      ],
    },
    {
      type: 'heading',
      text: '3. Votre consentement',
    },
    {
      type: 'paragraph',
      text: 'Les traceurs strictement nécessaires au fonctionnement et à la sécurité du service sont déposés sans recueil de votre consentement. Les traceurs de mesure d’audience et de publicité ne sont déposés qu’après votre accord, exprimé au moyen du bandeau affiché lors de votre première visite. Vous pouvez les accepter, les refuser, ou choisir par catégorie.',
    },
    {
      type: 'heading',
      text: '4. Modifier ou retirer votre choix',
    },
    {
      type: 'paragraph',
      text: 'Vous pouvez à tout moment revenir sur votre choix depuis le bandeau de gestion des cookies, accessible à partir du service, ou depuis les paramètres de votre appareil. Le retrait de votre consentement ne remet pas en cause la licéité des traitements réalisés avant ce retrait.',
    },
    {
      type: 'heading',
      text: '5. Si vous refusez',
    },
    {
      type: 'paragraph',
      text: 'Le refus des traceurs de mesure et de publicité n’empêche pas l’utilisation de Sama Naffa. Seules les fonctions de mesure d’audience et de personnalisation sont désactivées. Les traceurs nécessaires au fonctionnement et à la sécurité restent actifs.',
    },
    {
      type: 'heading',
      text: '6. Gérer les cookies depuis votre navigateur',
    },
    {
      type: 'paragraph',
      text: 'La plupart des navigateurs permettent de refuser ou de supprimer les cookies dans leurs paramètres. Le blocage des cookies nécessaires peut toutefois dégrader le fonctionnement du service.',
    },
    {
      type: 'heading',
      text: '7. Mise à jour de cette politique',
    },
    {
      type: 'paragraph',
      text: 'Cette politique peut évoluer pour tenir compte des évolutions techniques ou réglementaires. Toute modification est publiée sur cette page.',
    },
    {
      type: 'heading',
      text: '8. Contact',
    },
    {
      type: 'paragraph',
      text: 'Pour toute question relative aux cookies, vous pouvez écrire à samanaffa@everestfin.com. Pour le détail du traitement de vos données personnelles, consultez la politique de confidentialité.',
    },
  ],
};
