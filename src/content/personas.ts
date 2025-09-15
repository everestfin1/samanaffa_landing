export interface Persona {
  slug: string;
  name: string;
  icon: string;
  defaults: {
    amount: number;
    months: number;
  };
  description: string;
  benefits: string[];
  targetGoals: string[];
}

export const personas: Persona[] = [
  {
    slug: 'etudiant',
    name: 'Étudiant',
    icon: '🎓',
    defaults: { amount: 25000, months: 12 },
    description: 'Parfait pour financer vos études ou préparer votre avenir professionnel.',
    benefits: [
      'Taux préférentiel pour les jeunes',
      'Flexibilité de retrait',
      'Bonus fidélité après 6 mois'
    ],
    targetGoals: [
      'Frais de scolarité',
      'Matériel informatique',
      'Préparation à la vie active'
    ]
  },
  {
    slug: 'entrepreneur',
    name: 'Entrepreneur',
    icon: '🚀',
    defaults: { amount: 100000, months: 18 },
    description: 'Conçu pour les créateurs d\'entreprises et les projets innovants.',
    benefits: [
      'Taux boosté pour les entrepreneurs',
      'Conseils business intégrés',
      'Réseau d\'investisseurs partenaires'
    ],
    targetGoals: [
      'Capital de démarrage',
      'Expansion d\'activité',
      'Innovation technologique'
    ]
  },
  {
    slug: 'diaspora',
    name: 'Diaspora',
    icon: '🌍',
    defaults: { amount: 200000, months: 24 },
    description: 'Solution idéale pour les Sénégalais de la diaspora souhaitant investir au pays.',
    benefits: [
      'Transferts sécurisés depuis l\'étranger',
      'Taux compétitifs en devise locale',
      'Accompagnement personnalisé'
    ],
    targetGoals: [
      'Investissement immobilier',
      'Création d\'entreprise',
      'Soutien familial'
    ]
  },
  {
    slug: 'fonctionnaire',
    name: 'Fonctionnaire',
    icon: '🏛️',
    defaults: { amount: 150000, months: 36 },
    description: 'Programme spécial pour les agents de la fonction publique.',
    benefits: [
      'Déduction automatique sur salaire',
      'Garantie de l\'État',
      'Privilèges exclusifs'
    ],
    targetGoals: [
      'Épargne retraite anticipée',
      'Projets immobiliers',
      'Formation continue'
    ]
  },
  {
    slug: 'tontine',
    name: 'Tontine',
    icon: '🤝',
    defaults: { amount: 50000, months: 6 },
    description: 'Pour les groupes d\'épargne collective et les associations.',
    benefits: [
      'Gestion simplifiée des cotisations',
      'Transparence totale',
      'Réunions virtuelles intégrées'
    ],
    targetGoals: [
      'Épargne collective',
      'Projets communautaires',
      'Solidarité financière'
    ]
  },
];

export function getPersonaBySlug(slug: string): Persona | undefined {
  return personas.find(persona => persona.slug === slug);
}

export function getAllPersonaSlugs(): string[] {
  return personas.map(persona => persona.slug);
}
