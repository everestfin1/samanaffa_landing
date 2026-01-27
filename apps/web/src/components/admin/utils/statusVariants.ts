export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export type StatusDomain =
  | 'transaction'
  | 'kyc'
  | 'abandonedLead'
  | 'apeSubscription'
  | 'sponsorCode'
  | 'reconciliation'
  | 'peeLead';

export function getStatusVariant(status: string, domain: StatusDomain): BadgeVariant {
  switch (domain) {
    case 'transaction': {
      if (status === 'COMPLETED') return 'success';
      if (status === 'PROCESSING') return 'info';
      if (status === 'PENDING') return 'warning';
      if (status === 'FAILED') return 'danger';
      return 'default';
    }

    case 'kyc': {
      if (status === 'APPROVED') return 'success';
      if (status === 'PENDING' || status === 'UNDER_REVIEW') return 'warning';
      if (status === 'REJECTED') return 'danger';
      return 'default';
    }

    case 'abandonedLead': {
      if (status === 'CONVERTED') return 'success';
      if (status === 'ABANDONED' || status === 'CONTACTED') return 'warning';
      if (status === 'DISMISSED') return 'danger';
      return 'default';
    }

    case 'apeSubscription': {
      if (status === 'ACTIVE') return 'success';
      if (status === 'CANCELLED') return 'danger';
      return 'default';
    }

    case 'sponsorCode': {
      if (status === 'ACTIVE') return 'success';
      if (status === 'INACTIVE') return 'warning';
      if (status === 'EXPIRED') return 'danger';
      return 'default';
    }

    case 'reconciliation': {
      if (status === 'MATCHED') return 'success';
      if (status === 'MISMATCHED') return 'danger';
      return 'default';
    }

    case 'peeLead': {
      if (status === 'NEW') return 'info';
      if (status === 'CONTACTED') return 'warning';
      return 'default';
    }

    default:
      return 'default';
  }
}
