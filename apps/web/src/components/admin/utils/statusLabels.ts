export const transactionStatusLabels: Record<string, string> = {
  PENDING: 'En attente',
  PROCESSING: 'En cours',
  COMPLETED: 'Complétée',
  CANCELLED: 'Annulée',
  FAILED: 'Échouée',
};

export const kycStatusLabels: Record<string, string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté',
  UNDER_REVIEW: 'En révision',
};

export const abandonedLeadStatusLabels: Record<string, string> = {
  ABANDONED: 'Abandonné',
  CONTACTED: 'Contacté',
  CONVERTED: 'Converti',
  DISMISSED: 'Rejeté',
};

export const apeSubscriptionStatusLabels: Record<string, string> = {
  PENDING: 'En attente',
  PAYMENT_INITIATED: 'Paiement initié',
  PAYMENT_SUCCESS: 'Paiement réussi',
  PAYMENT_FAILED: 'Paiement échoué',
  CANCELLED: 'Annulée',
};

export const sponsorCodeStatusLabels: Record<string, string> = {
  ACTIVE: 'Actif',
  INACTIVE: 'Inactif',
  EXPIRED: 'Expiré',
};

export const reconciliationStatusLabels: Record<string, string> = {
  MATCHED: 'Correspondante',
  MISMATCHED: 'Divergente',
};

export const peeLeadStatusLabels: Record<string, string> = {
  NEW: 'Nouveau',
  CONTACTED: 'Contacté',
};
