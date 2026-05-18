import { getNaffaProductById, type NaffaProduct } from '@/lib/naffa-products';

/** Maps quiz “Formule *” labels to Naffa product catalog ids. */
const FORMULA_TO_PRODUCT_ID: Record<string, string> = {
  'Formule Croissance': 'prestige',
  'Formule Libre': 'liberte',
  'Formule Équilibre': 'serenite',
};

export function resolveProductForFormula(formulaName: string): NaffaProduct {
  const productId = FORMULA_TO_PRODUCT_ID[formulaName] ?? 'default';
  return getNaffaProductById(productId);
}
