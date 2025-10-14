/**
 * Date Utilities for French Localization
 * 
 * Functions to format dates in French for better UX
 */

/**
 * Format a date in French locale with full details
 * Example: "9 octobre 2025 à 23:30"
 */
export function formatDateFrench(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format a date in French locale with short format
 * Example: "09/10/2025"
 */
export function formatDateShortFrench(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Get relative time in French
 * Example: "il y a 2 heures", "dans 3 jours", "aujourd'hui"
 */
export function getRelativeTimeFrench(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Less than 1 minute
  if (Math.abs(diffSec) < 60) {
    return 'à l\'instant';
  }

  // Less than 1 hour
  if (Math.abs(diffMin) < 60) {
    if (diffMin < 0) {
      return `il y a ${Math.abs(diffMin)} minute${Math.abs(diffMin) > 1 ? 's' : ''}`;
    }
    return `dans ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
  }

  // Less than 24 hours
  if (Math.abs(diffHours) < 24) {
    if (diffHours < 0) {
      return `il y a ${Math.abs(diffHours)} heure${Math.abs(diffHours) > 1 ? 's' : ''}`;
    }
    return `dans ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  }

  // Less than 7 days
  if (Math.abs(diffDays) < 7) {
    if (diffDays < 0) {
      return `il y a ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`;
    }
    return `dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  }

  // More than 7 days - return short date
  return formatDateShortFrench(dateObj);
}

/**
 * Get French status label
 */
export function getStatusLabelFrench(status: string): string {
  const statusMap: Record<string, string> = {
    'COMPLETED': 'Terminé',
    'PENDING': 'En attente',
    'FAILED': 'Échoué',
    'CANCELLED': 'Annulé',
    'REJECTED': 'Rejeté',
  };

  return statusMap[status] || status;
}

/**
 * Get French transaction type label
 */
export function getTransactionTypeLabelFrench(type: string): string {
  const typeMap: Record<string, string> = {
    'DEPOSIT': 'Dépôt',
    'WITHDRAWAL': 'Retrait',
    'INVESTMENT': 'Investissement',
  };

  return typeMap[type] || type;
}



