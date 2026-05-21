import Decimal from 'decimal.js';

export const SAVINGS_MENSUALITE_MIN = 1000;
export const SAVINGS_MENSUALITE_MAX = 500_000;
export const SAVINGS_MENSUALITE_STEP = 1000;
export const SAVINGS_DUREE_MIN = 6;
export const SAVINGS_DUREE_MAX = 180;

export function tauxParDuree(mois: number): number {
  if (mois <= 6) return 3.5;
  if (mois <= 12) return 4.5;
  if (mois <= 36) return 6.0;
  if (mois <= 60) return 7.0;
  if (mois <= 120) return 8.5;
  return 10.0;
}

function getDaysRemaining(monthIndex: number, totalMonths: number): number {
  const exactDays12Months = [365, 334, 306, 275, 245, 214, 184, 153, 122, 92, 61, 1];

  if (totalMonths === 12 && monthIndex < 12) {
    return exactDays12Months[monthIndex];
  }

  const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let daysRemaining = 0;
  for (let i = monthIndex; i < totalMonths; i++) {
    daysRemaining += monthLengths[i % 12];
  }
  if (monthIndex === totalMonths - 1) {
    return 1;
  }
  return daysRemaining;
}

export function calculerCapitalFinal(
  mensuel: number,
  dureeMois: number,
  tauxAnnuel: number,
): { capitalFinal: number; interets: number } {
  Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

  const tauxAnnuelDecimal = new Decimal(tauxAnnuel).div(100);
  const montantMensuel = new Decimal(mensuel);
  let capitalFinal = new Decimal(0);

  for (let i = 0; i < dureeMois; i++) {
    const joursRestants = getDaysRemaining(i, dureeMois);
    const exponent = new Decimal(joursRestants).div(365);
    const facteur = new Decimal(1).plus(tauxAnnuelDecimal).pow(exponent);
    capitalFinal = capitalFinal.plus(montantMensuel.times(facteur));
  }

  const capitalVerse = mensuel * dureeMois;
  const interets = capitalFinal.toNumber() - capitalVerse;

  return {
    capitalFinal: capitalFinal.toNumber(),
    interets,
  };
}

export function validateMensualite(value: number): string | null {
  if (Number.isNaN(value) || value < SAVINGS_MENSUALITE_MIN) {
    return 'Le montant minimum est de 1 000 FCFA';
  }
  if (value > SAVINGS_MENSUALITE_MAX) {
    return 'Le montant maximum est de 500 000 FCFA';
  }
  if (value % SAVINGS_MENSUALITE_STEP !== 0) {
    return 'Le montant doit être un multiple de 1 000 FCFA';
  }
  return null;
}

export function validateDuree(value: number): string | null {
  if (Number.isNaN(value) || value < SAVINGS_DUREE_MIN) {
    return 'La durée minimum est de 6 mois';
  }
  if (value > SAVINGS_DUREE_MAX) {
    return 'La durée maximum est de 180 mois (15 ans)';
  }
  return null;
}

export function dureeTermLabel(duree: number): string {
  if (duree <= 6) return '💡 Très court terme';
  if (duree <= 12) return '📈 Court terme';
  if (duree <= 36) return '🚀 Moyen terme';
  if (duree <= 60) return '💎 Long terme';
  return '🏆 Très long terme';
}
