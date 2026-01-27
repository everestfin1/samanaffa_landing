export const transactionStatusLabels: Record<string, string> = {
  PENDING: 'En attente',
  PROCESSING: 'En cours',
  COMPLETED: 'Complétée',
  CANCELLED: 'Annulée',
  FAILED: 'Échouée',
};

export const transactionStatusOptions = [
  { label: 'Tous les statuts', value: '' },
  { label: 'En attente', value: 'PENDING' },
  { label: 'En cours', value: 'PROCESSING' },
  { label: 'Complétée', value: 'COMPLETED' },
  { label: 'Annulée', value: 'CANCELLED' },
  { label: 'Échouée', value: 'FAILED' },
];

export const kycStatusLabels: Record<string, string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté',
  UNDER_REVIEW: 'En révision',
};

export const kycStatusOptions = [
  { label: 'Tous les statuts', value: '' },
  { label: 'En attente', value: 'PENDING' },
  { label: 'Approuvé', value: 'APPROVED' },
  { label: 'Rejeté', value: 'REJECTED' },
  { label: 'En révision', value: 'UNDER_REVIEW' },
];

export const abandonedLeadStatusLabels: Record<string, string> = {
  ABANDONED: 'Abandonné',
  CONTACTED: 'Contacté',
  CONVERTED: 'Converti',
  DISMISSED: 'Rejeté',
};

export const abandonedLeadStatusOptions = [
  { label: 'Tous les statuts', value: '' },
  { label: 'Abandonné', value: 'ABANDONED' },
  { label: 'Contacté', value: 'CONTACTED' },
  { label: 'Converti', value: 'CONVERTED' },
  { label: 'Rejeté', value: 'DISMISSED' },
];

export const apeSubscriptionStatusLabels: Record<string, string> = {
  PENDING: 'En attente',
  PAYMENT_INITIATED: 'Paiement initié',
  PAYMENT_SUCCESS: 'Paiement réussi',
  PAYMENT_FAILED: 'Paiement échoué',
  CANCELLED: 'Annulée',
};

export const apeSubscriptionStatusOptions = [
  { label: 'Tous les statuts', value: '' },
  { label: 'En attente', value: 'PENDING' },
  { label: 'Paiement initié', value: 'PAYMENT_INITIATED' },
  { label: 'Paiement réussi', value: 'PAYMENT_SUCCESS' },
  { label: 'Paiement échoué', value: 'PAYMENT_FAILED' },
  { label: 'Annulée', value: 'CANCELLED' },
];

export const sponsorCodeStatusLabels: Record<string, string> = {
  ACTIVE: 'Actif',
  INACTIVE: 'Inactif',
  EXPIRED: 'Expiré',
};

export const sponsorCodeStatusOptions = [
  { label: 'Tous les statuts', value: '' },
  { label: 'Actif', value: 'ACTIVE' },
  { label: 'Inactif', value: 'INACTIVE' },
  { label: 'Expiré', value: 'EXPIRED' },
];

export const reconciliationStatusLabels: Record<string, string> = {
  MATCHED: 'Correspondante',
  MISMATCHED: 'Divergente',
};

export const reconciliationStatusOptions = [
  { label: 'Tous les statuts', value: '' },
  { label: 'Correspondante', value: 'MATCHED' },
  { label: 'Divergente', value: 'MISMATCHED' },
];

export const peeLeadStatusLabels: Record<string, string> = {
  NEW: 'Nouveau',
  CONTACTED: 'Contacté',
};

export const peeLeadStatusOptions = [
  { label: 'Tous les statuts', value: '' },
  { label: 'Nouveau', value: 'NEW' },
  { label: 'Contacté', value: 'CONTACTED' },
];
