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
