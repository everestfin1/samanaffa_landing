export type NaffaProduct = {
  id: string;
  name: string;
  productCode: string;
  interestRate: number;
  lockPeriodMonths: number;
  allowAdditionalDeposits: boolean;
  metadata?: Record<string, unknown>;
};

const yearToMonths = (years: number) => Math.max(1, Math.round(years * 12));

export const NAFFA_PRODUCTS: NaffaProduct[] = [
  {
    id: 'default',
    name: 'Naffa Classique',
    productCode: 'SN-DEFAULT',
    interestRate: 4.5,
    lockPeriodMonths: 12,
    allowAdditionalDeposits: true,
    metadata: {
      description: 'Compte d’épargne Sama Naffa classique',
    },
  },
  {
    id: 'etudes-enfant',
    name: 'Naffa Études Enfant',
    productCode: 'SN-ETUDES',
    interestRate: 4.5,
    lockPeriodMonths: yearToMonths(15),
    allowAdditionalDeposits: true,
  },
  {
    id: 'business',
    name: 'Naffa Business',
    productCode: 'SN-BIZ',
    interestRate: 4.5,
    lockPeriodMonths: yearToMonths(5),
    allowAdditionalDeposits: true,
  },
  {
    id: 'diaspora',
    name: 'Naffa Diaspora',
    productCode: 'SN-DIASPORA',
    interestRate: 4.5,
    lockPeriodMonths: yearToMonths(10),
    allowAdditionalDeposits: true,
  },
  {
    id: 'serenite',
    name: 'Naffa Sérénité',
    productCode: 'SN-SERENITE',
    interestRate: 4.5,
    lockPeriodMonths: yearToMonths(10),
    allowAdditionalDeposits: true,
  },
  {
    id: 'communautaire',
    name: 'Naffa Communautaire',
    productCode: 'SN-COMMUNAUTAIRE',
    interestRate: 4.5,
    lockPeriodMonths: yearToMonths(5),
    allowAdditionalDeposits: true,
  },
  {
    id: 'liberte',
    name: 'Naffa Liberté',
    productCode: 'SN-LIBERTE',
    interestRate: 4.5,
    lockPeriodMonths: yearToMonths(7),
    allowAdditionalDeposits: true,
  },
  {
    id: 'prestige',
    name: 'Naffa Prestige',
    productCode: 'SN-PRESTIGE',
    interestRate: 4.5,
    lockPeriodMonths: yearToMonths(7),
    allowAdditionalDeposits: true,
  },
];

export function getNaffaProductById(id?: string | null): NaffaProduct {
  if (!id) {
    return NAFFA_PRODUCTS[0];
  }

  return (
    NAFFA_PRODUCTS.find((product) => product.id === id) ?? NAFFA_PRODUCTS[0]
  );
}
