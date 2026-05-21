import { objectives } from '@/components/data/objectives';
import { tauxParDuree } from '@/lib/savings-simulation';

export const NAFFA_CUSTOM_NAME_MIN = 2;
export const NAFFA_CUSTOM_NAME_MAX = 60;

/** User-defined plan parameters that define a Sama Naffa account. */
export type NaffaPlanInput = {
  objectiveSlug: string;
  objectiveId: number;
  objectiveName: string;
  objectiveTitre: string;
  monthlyAmount: number;
  durationMonths: number;
  /** Required when objectiveSlug is "autres". */
  customName?: string;
};

export type NaffaAccountCreatePayload = {
  productId: string;
  productName: string;
  productCode: string;
  interestRate: number;
  lockPeriodMonths: number;
  allowAdditionalDeposits: boolean;
  metadata: {
    objectiveSlug: string;
    objectiveId: number;
    objectiveName: string;
    objectiveTitre: string;
    monthlyAmount: number;
    durationMonths: number;
    plannedInterestRate: number;
    customName?: string;
  };
};

export function validateCustomNaffaName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'Donnez un nom à votre Naffa.';
  }
  if (trimmed.length < NAFFA_CUSTOM_NAME_MIN) {
    return `Le nom doit contenir au moins ${NAFFA_CUSTOM_NAME_MIN} caractères.`;
  }
  if (trimmed.length > NAFFA_CUSTOM_NAME_MAX) {
    return `Le nom ne peut pas dépasser ${NAFFA_CUSTOM_NAME_MAX} caractères.`;
  }
  return null;
}

export function getObjectiveBySlug(slug: string) {
  return objectives.find((o) => o.slug === slug);
}

function resolveNaffaDisplayName(plan: NaffaPlanInput): string {
  if (plan.objectiveSlug === 'autres' && plan.customName?.trim()) {
    return plan.customName.trim();
  }
  return plan.objectiveName;
}

/** Builds the API payload for POST /api/accounts from a validated plan. */
export function buildNaffaAccountPayload(plan: NaffaPlanInput): NaffaAccountCreatePayload {
  const interestRate = tauxParDuree(plan.durationMonths);
  const displayName = resolveNaffaDisplayName(plan);
  const customName =
    plan.objectiveSlug === 'autres' && plan.customName?.trim()
      ? plan.customName.trim()
      : undefined;

  return {
    productId: 'default',
    productName: `Naffa · ${displayName}`,
    productCode: 'SN-DEFAULT',
    interestRate,
    lockPeriodMonths: plan.durationMonths,
    allowAdditionalDeposits: true,
    metadata: {
      objectiveSlug: plan.objectiveSlug,
      objectiveId: plan.objectiveId,
      objectiveName: plan.objectiveName,
      objectiveTitre: plan.objectiveTitre,
      monthlyAmount: plan.monthlyAmount,
      durationMonths: plan.durationMonths,
      plannedInterestRate: interestRate,
      ...(customName ? { customName } : {}),
    },
  };
}
