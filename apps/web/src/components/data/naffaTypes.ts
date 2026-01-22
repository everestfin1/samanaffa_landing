export interface NaffaType {
  id: string;
  name: string;
  persona: string;
  defaultAmount: number;
  duration: number;
  objective: string;
  message: string;
  icon: string;
  color: string;
  description: string;
}

export const naffaTypes: NaffaType[] = [
  {
    id: 'etudes-enfant',
    name: 'Naffa Études Enfant',
    persona: 'Parent salarié ',
    defaultAmount: 25000,
    duration: 15,
    objective: 'Financer les études supérieures de l\'enfant',
    message: 'Assurez l\'avenir de vos enfants pas à pas.',
    icon: '🎓',
    color: 'blue',
    description: 'Épargnez pour l\'éducation de vos enfants avec un plan sur 15 ans'
  },
  {
    id: 'business',
    name: 'Naffa Business',
    persona: 'Entrepreneur, commerçant (Explorer / Héros)',
    defaultAmount: 30000,
    duration: 5,
    objective: 'Faire grandir un commerce ou lancer un projet',
    message: 'Donnez des ailes à votre ambition.',
    icon: '💼',
    color: 'green',
    description: 'Développez votre entreprise avec un épargne dédiée sur 5 ans'
  },
  {
    id: 'diaspora',
    name: 'Naffa Diaspora',
    persona: 'Travailleurs à l\'étranger (Explorer)',
    defaultAmount: 50000,
    duration: 10,
    objective: 'Construire une maison ou préparer un retour au pays',
    message: 'Votre avenir au pays commence aujourd\'hui.',
    icon: '🏠',
    color: 'purple',
    description: 'Préparez votre retour au pays avec un plan d\'épargne sur 10 ans'
  },
  {
    id: 'serenite',
    name: 'Naffa Sérénité',
    persona: 'Fonctionnaire ou salarié prudent ',
    defaultAmount: 20000,
    duration: 10,
    objective: 'Préparer sa retraite ou sécuriser son futur',
    message: 'Bâtissez votre tranquillité demain dès aujourd\'hui.',
    icon: '🛡️',
    color: 'gray',
    description: 'Sécurisez votre avenir avec une épargne prudente sur 10 ans'
  },
  {
    id: 'communautaire',
    name: 'Naffa Communautaire',
    persona: 'Gérantes de tontines, associations formelles ou informelles (Communautaire)',
    defaultAmount: 10000,
    duration: 5, // Flexible 3-7 ans, using 5 as default
    objective: 'Épargne collective, projet commun, solidarité',
    message: 'Épargnons ensemble, réussissons ensemble.',
    icon: '🤝',
    color: 'orange',
    description: 'Épargnez en groupe pour des projets communautaires'
  },
  {
    id: 'liberte',
    name: 'Naffa Liberté',
    persona: 'Jeunes actifs (Explorer)',
    defaultAmount: 15000,
    duration: 7,
    objective: 'Voyage, achat d\'une voiture, premier investissement',
    message: 'Transformez vos rêves en projets concrets.',
    icon: '✈️',
    color: 'yellow',
    description: 'Réalisez vos projets personnels avec une épargne flexible'
  },
  {
    id: 'prestige',
    name: 'Naffa Prestige',
    persona: 'Hauts revenus, investisseurs rationnels (Sage / Héros)',
    defaultAmount: 100000,
    duration: 7, // 5-10 ans, using 7 as default
    objective: 'Diversification patrimoniale, investissements obligataires',
    message: 'Un placement intelligent, à la hauteur de vos ambitions.',
    icon: '💎',
    color: 'red',
    description: 'Placement premium pour la diversification de votre patrimoine'
  }
];

export const getNaffaTypeById = (id: string): NaffaType | undefined => {
  return naffaTypes.find(naffa => naffa.id === id);
};

export const getNaffaTypesByPersona = (persona: string): NaffaType[] => {
  return naffaTypes.filter(naffa => naffa.persona.toLowerCase().includes(persona.toLowerCase()));
};
